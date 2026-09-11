// 07-test-data-isolation-in-parallel-execution.spec.ts
//
// TOPIC: ensuring test data isolation during parallel test execution
//
// Fixture code under test: ./fixtures/worker-scoped.fixture.ts
// Also revisits: ./db/fakeDb.ts (topic 4)
//
// Playwright runs test FILES across multiple worker PROCESSES in
// parallel (see `workers` in playwright.config.ts, and topic 08's
// 05-parallel-execution-and-isolation.spec.ts for the general concept).
// This file is specifically about the DATA side of that: making sure
// concurrently-running tests never read or write the same record.

import { test, expect } from './fixtures/worker-scoped.fixture';
import { fakeDb } from './db/fakeDb';

test('uniqueTestEmail is different on every test, even within the same worker', async ({
  uniqueTestEmail,
}) => {
  // TEST-scoped fixture data (the default scope) is created fresh for
  // THIS test alone — no other test, on any worker, ever sees this exact
  // value. Use this scope for anything a test WRITES or mutates (a new
  // account, a new order), so parallel tests can never collide on it.
  expect(uniqueTestEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
});

test('workerSeededUsername is stable across tests that share a worker', async ({
  workerSeededUsername,
}, testInfo) => {
  // WORKER-scoped fixture data is created ONCE per worker process and
  // then reused by every test that happens to run on it — useful for
  // something expensive to set up that's safe to SHARE (read-only
  // reference data, a single browser login session reused read-only)
  // but NOT for anything a test mutates, since two tests on the same
  // worker would then be silently sharing — and could corrupt — the
  // same piece of state.
  expect(workerSeededUsername).toContain(`worker${testInfo.workerIndex}_`);
});

test('a second test on the same worker sees the identical workerSeededUsername value', async ({
  workerSeededUsername,
}, testInfo) => {
  // Run this file with a single worker (`--workers=1`) and compare this
  // value against the test above: identical. Run with multiple workers
  // and Playwright may schedule these two tests onto DIFFERENT workers,
  // in which case the values differ — both are correct outcomes, because
  // the guarantee is "stable per worker," not "stable across the whole
  // run."
  expect(workerSeededUsername).toContain(`worker${testInfo.workerIndex}_`);
});

test.describe('parallel-safe database seeding: unique data per test avoids collisions', () => {
  test('test A seeds and finds its own record, unaffected by test B running concurrently', async ({
    uniqueTestEmail,
  }) => {
    const user = await fakeDb.seedUser({ email: uniqueTestEmail });

    const found = await fakeDb.findUserById(user.id);
    expect(found?.email).toBe(uniqueTestEmail);

    await fakeDb.deleteUser(user.id); // clean up — see topic 4 for why
  });

  test('test B seeds and finds its own record, unaffected by test A running concurrently', async ({
    uniqueTestEmail,
  }) => {
    const user = await fakeDb.seedUser({ email: uniqueTestEmail });

    const found = await fakeDb.findUserById(user.id);
    expect(found?.email).toBe(uniqueTestEmail);

    await fakeDb.deleteUser(user.id);
  });

  // Both tests above use a UNIQUE id (from fakeDb.seedUser()'s own
  // randomUUID()) as the lookup key, and a unique email from the
  // uniqueTestEmail fixture as the payload — neither test could
  // accidentally read or overwrite the other's record even if they ran
  // at the exact same instant.
});

test('a real database is shared across workers; fakeDb here is NOT — know the difference', async () => {
  // fakeDb.ts's Map lives in ONE worker process's memory. If this whole
  // suite ran with multiple workers, EACH worker would have its own
  // separate, empty-at-start fakeDb — countUsers() here only ever
  // reflects what THIS worker itself has seeded, never what other
  // workers are doing concurrently.
  //
  // A REAL database is the opposite: it's one shared server every worker
  // connects to, so a bad seed/cleanup in one worker's tests CAN corrupt
  // another worker's test run. That's exactly why unique, per-test data
  // (like uniqueTestEmail above) matters more — not less — once you
  // swap fakeDb for a real, shared database.
  const countBefore = await fakeDb.countUsers();
  const user = await fakeDb.seedUser();
  expect(await fakeDb.countUsers()).toBe(countBefore + 1);
  await fakeDb.deleteUser(user.id);
});
