// framework/fixtures/base-fixtures.ts
//
// Extends Playwright's base `test` with fixtures shared across the whole
// framework, so spec files get them just by destructuring the test
// callback's argument — the same way they already get `page` or `context`.
//
// Spec files import `test`/`expect` from THIS file instead of directly
// from '@playwright/test' to get access to the extra fixtures below (this
// mirrors the pattern used for custom matchers in
// tests/05-Assertions & Validations/support/custom-matchers.ts).

import { test as base, expect } from '@playwright/test';
import { config as envConfig } from '../config/env';
import { Logger } from '../logger/logger';
import { SafeActions } from '../core/safeActions';
import { createRandomUser, type TestUser } from '../factories/userFactory';

interface FrameworkFixtures {
  /** Logger pre-scoped to the current test's title, so log lines are traceable. */
  logger: Logger;
  /** Retry/logging wrapper around common Playwright actions, see core/safeActions.ts. */
  safeActions: SafeActions;
  /** A fresh, randomly-generated user for tests that just need "some" valid user data. */
  testUser: TestUser;
  /** The active environment config (baseURL, credentials, timeouts) for the current TEST_ENV. */
  config: typeof envConfig;
}

export const test = base.extend<FrameworkFixtures>({
  logger: async ({}, use, testInfo) => {
    const logger = new Logger(testInfo.title);
    logger.info('--- test starting ---');
    await use(logger);
    logger.info(`--- test finished: ${testInfo.status} ---`);
  },

  safeActions: async ({ logger }, use) => {
    await use(new SafeActions(logger.child('safeActions')));
  },

  testUser: async ({}, use) => {
    await use(createRandomUser());
  },

  config: async ({}, use) => {
    await use(envConfig);
  },
});

export { expect };
