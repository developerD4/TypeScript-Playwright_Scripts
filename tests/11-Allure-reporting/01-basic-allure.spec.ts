import { test, expect } from '@playwright/test';

/*
 * Basic Allure integration:
 * No Allure code is required inside this test.
 * The allure-playwright reporter records the test automatically.
 */

test('OrangeHRM user can log in', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');

  await page.locator('input[name="username"]').fill('Admin');
  await page.locator('input[name="password"]').fill('admin123');
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.locator('h6')).toHaveText('Dashboard');
});
