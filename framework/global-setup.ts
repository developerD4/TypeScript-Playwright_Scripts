// framework/global-setup.ts
//
// Runs ONCE, before any test worker starts — not once per test file. Good
// for expensive, shared, one-time setup: verifying the target environment
// is reachable, seeding shared data, logging in once and saving auth state
// for every test to reuse, etc.
//
// Anything assigned to process.env here IS visible inside test files too:
// Playwright runs globalSetup in the main process and only spawns worker
// processes afterwards, so workers inherit this modified environment.
//
// Wired up via `globalSetup` in playwright.config.ts.

import type { FullConfig } from '@playwright/test';
import { request } from '@playwright/test';
import { config } from './config/env';
import { rootLogger } from './logger/logger';
import { fileSafeTimestamp, isoTimestamp } from './utils/dateUtils';

async function globalSetup(_fullConfig: FullConfig): Promise<void> {
  const logger = rootLogger.child('globalSetup');
  const startedAt = isoTimestamp();
  const runId = fileSafeTimestamp();

  logger.info(`Starting test run "${runId}" against environment "${config.env}" (${config.baseURL})`);

  // A real-world smoke check: confirm the target environment is actually
  // up before spending time running the whole suite against it. Kept
  // non-fatal here (logged as a warning) since this hits a shared public
  // demo site outside our control — in a real project against your own
  // environment, you'd typically want this to throw and fail the run fast.
  const context = await request.newContext();
  try {
    const response = await context.get(config.baseURL, { timeout: config.apiTimeoutMs });
    if (response.ok()) {
      logger.info(`Environment reachability check passed (HTTP ${response.status()})`);
    } else {
      logger.warn(`Environment reachability check returned HTTP ${response.status()}`);
    }
  } catch (error) {
    logger.warn(`Environment reachability check failed: ${(error as Error).message}`);
  } finally {
    await context.dispose();
  }

  // Passed to test files (and to global-teardown.ts) via the environment,
  // per the note above.
  process.env.FRAMEWORK_RUN_ID = runId;
  process.env.FRAMEWORK_RUN_STARTED_AT = startedAt;

  logger.info('Global setup complete');
}

export default globalSetup;
