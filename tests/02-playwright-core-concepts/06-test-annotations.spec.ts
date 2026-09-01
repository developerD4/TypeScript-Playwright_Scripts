import { test, expect } from '@playwright/test';

test.describe('Test Annotations', () => {

  // 1. Skip a test
  test('Skip test on WebKit', async ({ page, browserName }) => {

    test.skip(
      browserName === 'webkit',
      'Not supported in WebKit'
    );

    await page.goto('https://demo.playwright.dev/todomvc');

    await expect(
      page.getByPlaceholder('What needs to be done?')
    ).toBeVisible();
  });


  // 2. Mark a test as known broken
  test('Known broken test', async ({ page }) => {

    test.fixme(
      true,
      'Feature is currently broken'
    );

    await page.goto('https://demo.playwright.dev/todomvc');

    await expect(page).toHaveURL(/todomvc/);
  });


  // 3. Give extra time to a slow test
  test('Slow test', async ({ page }) => {

    test.slow();

    await page.goto('https://demo.playwright.dev/todomvc');

    await page.getByPlaceholder('What needs to be done?')
      .fill('Buy milk');

    await page.getByPlaceholder('What needs to be done?')
      .press('Enter');

    await expect(page.locator('.todo-list li'))
      .toHaveCount(1);
  });


  // 4. Run only this test
  // Use only temporarily while debugging

  // test.only('Run only this test', async ({ page }) => {
  //   await page.goto('https://demo.playwright.dev/todomvc');
  // });

});