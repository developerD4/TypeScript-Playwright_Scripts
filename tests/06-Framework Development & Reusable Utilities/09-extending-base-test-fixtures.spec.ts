// 09-extending-base-test-fixtures.spec.ts
//
// TOPIC: extending Playwright's base test object for shared fixtures
// across the framework
//
// Framework code under test: framework/fixtures/base-fixtures.ts
//
// Note the import below: `test`/`expect` come from base-fixtures.ts, NOT
// from '@playwright/test' directly. base-fixtures.ts itself imports the
// real `test` and calls `.extend()` on it, so everything Playwright
// normally provides (page, context, browser, ...) is still available —
// PLUS the four extra fixtures defined there: logger, safeActions,
// testUser, and config. This is the same pattern used for custom matchers
// in tests/05-Assertions & Validations/support/custom-matchers.ts, applied
// to fixtures instead of matchers.

import { test, expect } from '../../framework/fixtures/base-fixtures';

test('logger fixture is pre-scoped to the test title automatically', async ({ logger }) => {
  // No `new Logger('...')` needed here — base-fixtures.ts already built
  // one scoped to this exact test's title and handed it to us.
  logger.info('This line is logged with this test\'s own name as its scope');
  expect(logger).toBeTruthy();
});

test('config fixture exposes the active environment without a manual import', async ({
  page,
  config,
}) => {
  await page.goto(config.baseURL);
  await expect(page).toHaveTitle('Swag Labs');
});

test('testUser fixture hands each test its own ready-to-use random user', async ({ testUser }) => {
  // Every test that asks for `testUser` gets a fresh one — built by
  // framework/factories/userFactory.ts under the hood — without importing
  // or calling the factory directly.
  expect(testUser.email).toContain('@');
  expect(testUser.username.length).toBeGreaterThan(0);
});

test('safeActions fixture combines the logger and retry wrapper for you', async ({
  page,
  safeActions,
  config,
}) => {
  await page.goto(config.baseURL);

  await safeActions.safeFill(page.locator('#user-name'), config.username);
  await safeActions.safeFill(page.locator('#password'), config.password);
  await safeActions.safeClick(page.locator('#login-button'));

  await expect(page).toHaveURL(/inventory\.html/);
});

test('all fixtures together: a realistic test using the whole framework at once', async ({
  page,
  logger,
  safeActions,
  config,
  testUser,
}) => {
  logger.info(`Starting realistic flow for generated user ${testUser.username}`);

  await page.goto(config.baseURL);
  await safeActions.safeFill(page.locator('#user-name'), config.username);
  await safeActions.safeFill(page.locator('#password'), config.password);
  await safeActions.safeClick(page.locator('#login-button'));

  await expect(page).toHaveURL(/inventory\.html/);
  logger.info('Reached inventory page successfully');
});
