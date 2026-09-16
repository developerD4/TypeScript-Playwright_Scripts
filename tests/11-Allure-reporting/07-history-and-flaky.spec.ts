import { test, expect } from '@playwright/test';

/*
 * History:
 * Allure history connects the same test across different report runs.
 * It allows us to see whether the test is stable or failing repeatedly.
 *
 * Flaky test:
 * A flaky test does not give a consistent result across runs or retries.
 * History helps us identify tests that fail and later pass again.
 */

test('OrangeHRM login test used for history', async ({ page }) => {
  await page.goto('/web/index.php/auth/login');

  await page.locator('input[name="username"]').fill('Admin');
  await page.locator('input[name="password"]').fill('admin123');
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/dashboard/);
});
