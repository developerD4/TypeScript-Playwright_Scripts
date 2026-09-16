import { test, expect } from '@playwright/test';

/*
 * Video recording:
 * Playwright records the browser session when video is enabled.
 * The allure-playwright reporter can include the recorded artifact in Allure.
 */

test.use({ video: 'on' });

test('OrangeHRM login flow with video recording', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');

  await page.locator('input[name="username"]').fill('Admin');
  await page.locator('input[name="password"]').fill('admin123');
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/dashboard/);
});
