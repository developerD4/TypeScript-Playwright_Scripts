import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/*
 * Allure step:
 * A step is a named action shown in the Allure test timeline.
 * allure.step() makes the report easier to understand.
 */

test('OrangeHRM login with readable Allure steps', async ({ page }) => {
  await allure.step('Open OrangeHRM login page', async () => {
    await page.goto('/web/index.php/auth/login');
  });

  await allure.step('Enter login details', async (step) => {
    await step.parameter('username', 'Admin');
    await step.parameter('password', 'admin123', 'masked');

    await page.locator('input[name="username"]').fill('Admin');
    await page.locator('input[name="password"]').fill('admin123');
  });

  await allure.step('Click Login', async () => {
    await page.locator('button[type="submit"]').click();
  });

  await expect(page).toHaveURL(/dashboard/);
});

/*
 * Attachment:
 * An attachment is extra evidence stored with a test result.
 * It can contain text, JSON, screenshots, traces, or other files.
 */

test('attach useful OrangeHRM test data', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');

  const title = await page.title();
  await allure.attachment('page-title.txt', title, 'text/plain');

  const testData = JSON.stringify(
    {
      application: 'OrangeHRM',
      username: 'Admin',
      pageTitle: title,
    },
    null,
    2
  );

  await allure.attachment('test-data.json', testData, 'application/json');

  await expect(page.locator('input[name="username"]')).toBeVisible();
});

/*
 * Labels and parameters:
 * Labels help organize and filter tests in Allure.
 * Parameters show the input or environment used by a test.
 */

test('add custom Allure metadata', async ({ page }) => {
  await allure.label('module', 'authentication');
  await allure.label('testType', 'smoke');
  await allure.parameter('environment', 'demo');

  await page.goto('/web/index.php/auth/login');

  await expect(page.locator('button[type="submit"]')).toBeVisible();
});
