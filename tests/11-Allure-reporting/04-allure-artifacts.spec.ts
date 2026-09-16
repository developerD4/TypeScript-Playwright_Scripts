import { test, expect } from '@playwright/test';

/*
 * Playwright artifacts:
 * Playwright can capture screenshots, videos, and traces automatically.
 * The allure-playwright reporter can include these artifacts in Allure.
 *
 * The main configuration is in playwright.config.ts.
 */

test('OrangeHRM login flow with automatic artifacts', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');

  await page.locator('input[name="username"]').fill('Admin');
  await page.locator('input[name="password"]').fill('admin123');
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/dashboard/);
});

/*
 * Manual screenshot:
 * A manual screenshot captures a specific moment chosen by the test.
 * It is useful when you want evidence at a particular point.
 */

test('manual screenshot of OrangeHRM login page', async ({ page }, testInfo) => {
  await page.goto('/web/index.php/auth/login');

  const screenshot = await page.screenshot({ fullPage: true });

  await testInfo.attach('orangehrm-login-page.png', {
    body: screenshot,
    contentType: 'image/png',
  });

  await expect(page.locator('input[name="username"]')).toBeVisible();
});

/*
 * Custom log:
 * A custom log records useful business-level information.
 * It gives the report a simple story of what the test did.
 */

test('attach a simple OrangeHRM test log', async ({ page }, testInfo) => {
  const log: string[] = [];

  const record = (message: string) => {
    log.push(`${new Date().toISOString()} - ${message}`);
  };

  record('Opening OrangeHRM login page');
  await page.goto('/web/index.php/auth/login');

  record('Checking username field');
  await expect(page.locator('input[name="username"]')).toBeVisible();

  record('Test completed');

  await testInfo.attach('test-log.txt', {
    body: log.join('\n'),
    contentType: 'text/plain',
  });
});
