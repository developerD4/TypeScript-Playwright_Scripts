import { test, expect } from '@playwright/test';

test.describe('Test Annotations', () => {

  // 1. test.skip()
  test('Skip this test on WebKit', async ({ page, browserName }) => {

    // Skip this test only when running in WebKit
    test.skip(
      browserName === 'webkit',
      'This test is not supported in WebKit'
    );

    await page.goto('https://demo.playwright.dev/todomvc');

    await expect(
      page.getByPlaceholder('What needs to be done?')
    ).toBeVisible();
  });


  // 2. test.fixme()
  test('Known broken test', async ({ page }) => {

    // Use fixme when the test is currently broken
    test.fixme(
      true,
      'This feature is currently broken and needs to be fixed'
    );

    await page.goto('https://demo.playwright.dev/todomvc');

    await expect(page).toHaveURL(/todomvc/);
  });


  // 3. test.slow()
  test('Slow test', async ({ page }) => {

    // Give this test more time to complete
    test.slow();

    await page.goto('https://demo.playwright.dev/todomvc');

    await page.getByPlaceholder('What needs to be done?')
      .fill('Buy milk');

    await page.getByPlaceholder('What needs to be done?')
      .press('Enter');

    await expect(page.locator('.todo-list li'))
      .toHaveCount(1);
  });


  // 4. test.only()
  // Use this temporarily when debugging one test.

  // test.only('Run only this test', async ({ page }) => {
  //   await page.goto('https://demo.playwright.dev/todomvc');
  //   await expect(page).toHaveURL(/todomvc/);
  // });

});