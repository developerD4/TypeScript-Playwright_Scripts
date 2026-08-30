import { test, expect } from '@playwright/test';

/**
 * 4. Test hooks: beforeAll, beforeEach, afterEach, afterAll
 *
 * - beforeAll  / afterAll  : run ONCE for the whole describe block (before
 *   the first test / after the last test).
 * - beforeEach / afterEach : run before/after EVERY individual test.
 */

test.describe('04 - Test hooks', () => {
  let sharedNote: string;

  test.beforeAll(() => {
    // Runs once, before any test in this file. Good for things that don't
    // need to be reset per test, like preparing shared (non-page) data.
    sharedNote = 'prepared once for the whole file';
    console.log('beforeAll: ', sharedNote);
  });

  test.beforeEach(async ({ page }) => {
    // Runs before EACH test below — here, every test starts on the same page.
    await page.goto('https://demo.playwright.dev/todomvc');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Runs after EACH test — useful for logging outcome or cleanup.
    console.log(`afterEach: "${testInfo.title}" finished with status ${testInfo.status}`);
  });

  test.afterAll(() => {
    // Runs once, after all tests in this file have completed.
    console.log('afterAll: cleaning up', sharedNote);
  });

  test('beforeEach already navigated to the todo app', async ({ page }) => {
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
  });

  test('each test still starts from the same clean page', async ({ page }) => {
    await page.getByPlaceholder('What needs to be done?').fill('Write hooks example');
    await page.getByPlaceholder('What needs to be done?').press('Enter');
    await expect(page.locator('.todo-list li')).toHaveCount(1);
  });
});

