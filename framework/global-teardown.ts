// framework/global-teardown.ts
//
// Runs ONCE, after every test in the run has finished (pass or fail). Good
// for summarizing the run, cleaning up shared resources created in
// globalSetup (temp accounts, seeded data, uploaded fixtures), etc.
//
// Wired up via `globalTeardown` in playwright.config.ts.

import type { FullConfig } from '@playwright/test';
import { rootLogger } from './logger/logger';

async function globalTeardown(_fullConfig: FullConfig): Promise<void> {
  const logger = rootLogger.child('globalTeardown');

  const runId = process.env.FRAMEWORK_RUN_ID ?? 'unknown';
  const startedAt = process.env.FRAMEWORK_RUN_STARTED_AT;
  const durationMs = startedAt ? Date.now() - new Date(startedAt).getTime() : undefined;

  logger.info(
    `Test run "${runId}" finished` +
      (durationMs !== undefined ? ` in ${(durationMs / 1000).toFixed(1)}s` : '')
  );

  // This is where you'd delete any shared/seeded data created in
  // globalSetup, e.g. an API-created test account that isn't tied to a
  // single test's own cleanup.
  logger.info('Global teardown complete');
}

export default globalTeardown;
