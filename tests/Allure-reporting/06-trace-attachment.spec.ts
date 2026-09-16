import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/*
 * Trace:
 * A trace records browser actions, screenshots, and page snapshots.
 * It is very useful when debugging a failed test.
 */

test('attach an OrangeHRM trace for one test', async ({ context, page }, testInfo) => {
  await context.tracing.start({
    screenshots: true,
    snapshots: true,
  });

  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await page.locator('input[name="username"]').fill('Admin');
  await page.locator('input[name="password"]').fill('admin123');
  await page.locator('button[type="submit"]').click();

  const tracePath = testInfo.outputPath('orangehrm-login-trace.zip');

  await context.tracing.stop({
    path: tracePath,
  });

  await allure.attachTrace('orangehrm-login-trace', tracePath);

  await expect(page).toHaveURL(/dashboard/);
});
