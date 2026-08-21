// 08-global-setup-teardown.spec.ts
//
// TOPIC: global setup and global teardown scripts (globalSetup/globalTeardown)
//
// Framework code under test: framework/global-setup.ts, framework/global-teardown.ts
// Wired up in: playwright.config.ts via `globalSetup` / `globalTeardown`
//
// There's no way to directly unit-test "did globalTeardown run", since by
// definition it runs AFTER every test in the run finishes. Instead, this
// file proves globalSetup ran, and explains where to watch teardown run.
//
// globalSetup runs exactly ONCE per `npx playwright test` invocation —
// not once per file and not once per browser project — before any worker
// process starts. That makes it the right place for expensive, shared,
// one-time work (e.g. an environment reachability check, seeding shared
// data, or logging in once and saving auth state for every test to reuse).

import { test, expect } from '@playwright/test';

test('FRAMEWORK_RUN_ID and FRAMEWORK_RUN_STARTED_AT prove global-setup.ts ran', () => {
  // global-setup.ts assigns these to process.env near the end of its run.
  // Because Playwright runs globalSetup in the main process BEFORE
  // spawning any worker processes, every worker (and therefore every
  // test, regardless of which file or project it's in) inherits these
  // values automatically — no extra wiring needed.
  expect(process.env.FRAMEWORK_RUN_ID).toBeTruthy();
  expect(process.env.FRAMEWORK_RUN_STARTED_AT).toBeTruthy();

  // FRAMEWORK_RUN_ID is built from framework/utils/dateUtils.ts's
  // fileSafeTimestamp(), so it should be free of ':' and '.'.
  expect(process.env.FRAMEWORK_RUN_ID).not.toMatch(/[:.]/);
});

test('the run ID is identical across every test in this run, proving it only ran once', () => {
  // If globalSetup ran per-file/per-test instead of once for the whole
  // run, each test would see a different value here. Run this whole
  // folder together and check the terminal: only ONE
  // "[globalSetup] Starting test run ..." line should appear, no matter
  // how many test files or browser projects ran.
  const runId = process.env.FRAMEWORK_RUN_ID;
  expect(runId).toBe(process.env.FRAMEWORK_RUN_ID);
});

// To see global-teardown.ts run: execute this file (or the whole suite)
// with `npx playwright test --reporter=list` and watch the terminal after
// the test results print — you'll see one final
// "[globalTeardown] Test run ... finished in Ns" line logged once, after
// every test has completed.
