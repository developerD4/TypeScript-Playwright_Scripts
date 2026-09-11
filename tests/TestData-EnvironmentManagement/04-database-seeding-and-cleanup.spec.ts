// 04-database-seeding-and-cleanup.spec.ts
//
// TOPIC: database seeding and clean-up strategies to support repeatable tests
//
// Backing "database": ./db/fakeDb.ts — an in-memory stand-in for a real DB
// client, so this pattern is runnable with no real server. Every fakeDb
// call has a comment showing the real SQL equivalent.
//
// "Seeding" means putting the database into a known state BEFORE a test
// runs (so the test doesn't depend on whatever data happened to already
// be there). "Clean-up" means removing what the test added AFTER it runs,
// so the next run of the same test starts from a clean slate again —
// without clean-up, tests stop being repeatable: run them twice and the
// second run either fails on a uniqueness constraint or silently counts
// leftover rows from the first run.

import { test, expect } from '@playwright/test';
import { fakeDb, type DbUser } from './db/fakeDb';

test.describe('seed before, clean up after — the standard per-test pattern', () => {
  let seededUser: DbUser;

  test.beforeEach(async () => {
    // SEED: create exactly the data this test needs, right before it runs.
    seededUser = await fakeDb.seedUser({ username: 'checkout_test_user' });
  });

  test.afterEach(async () => {
    // CLEAN UP: remove it again, whether the test passed or failed —
    // afterEach() runs either way. Skipping this step is how a suite
    // slowly accumulates thousands of leftover rows over months of runs.
    await fakeDb.deleteUser(seededUser.id);
  });

  test('the seeded user exists and has the expected username', async () => {
    const found = await fakeDb.findUserById(seededUser.id);
    expect(found?.username).toBe('checkout_test_user');
  });

  test('a second, independent test gets its OWN freshly seeded user', async () => {
    // beforeEach ran again for this test too — `seededUser` here is a
    // different record than the one in the test above, even though both
    // tests share the same describe block and hook.
    expect(seededUser.username).toBe('checkout_test_user');
    expect(await fakeDb.countUsers()).toBe(1); // only THIS test's user exists right now
  });
});

test.describe('proving clean-up actually ran', () => {
  test('the database has no leftover users from the previous describe block', async () => {
    // If the afterEach() above had been skipped or failed silently, this
    // count would be 2 (one leaked from each test in the block before).
    // Because clean-up ran after every test, we start here at zero.
    expect(await fakeDb.countUsers()).toBe(0);
  });
});

test.describe('seeding shared, READ-ONLY reference data once for a whole block', () => {
  // Not every seed needs to be per-test. Data that nothing in the block
  // MUTATES (e.g. a fixed reference/lookup record) is safe to seed once in
  // beforeAll instead of re-seeding it before every single test — cheaper,
  // and still safe specifically because no test here modifies it.
  let referenceUser: DbUser;

  test.beforeAll(async () => {
    referenceUser = await fakeDb.seedUser({ username: 'reference_admin', email: 'admin@example.com' });
  });

  test.afterAll(async () => {
    await fakeDb.deleteUser(referenceUser.id);
  });

  test('first test reads the shared reference user', async () => {
    const found = await fakeDb.findUserById(referenceUser.id);
    expect(found?.email).toBe('admin@example.com');
  });

  test('second test reads the SAME shared reference user, unmodified', async () => {
    const found = await fakeDb.findUserById(referenceUser.id);
    expect(found?.username).toBe('reference_admin');
  });
});

// ANTI-PATTERN — forgetting clean-up breaks repeatability:
//
//   test('bad: seeds but never cleans up', async () => {
//     const user = await fakeDb.seedUser({ username: 'duplicate_test_user' });
//     // ... test logic ...
//     // no deleteUser() call anywhere!
//   });
//
// Run this once: passes. Run it again immediately after: depending on the
// real database's constraints, it now either fails on a UNIQUE constraint
// (duplicate username), or silently passes while leaving TWO rows behind
// instead of one — and a countUsers()-style assertion elsewhere in the
// suite starts failing for a reason that has nothing to do with whatever
// that test actually checks. This is exactly why the two describe blocks
// above pair every seedUser() with a matching deleteUser() in
// afterEach()/afterAll().
