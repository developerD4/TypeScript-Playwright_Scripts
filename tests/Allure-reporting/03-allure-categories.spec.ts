import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

/*
 * Severity:
 * Severity describes the impact of a test failure.
 * Common values are blocker, critical, normal, minor, and trivial.
 *
 * Epic > Feature > Story:
 * Epic = large business area.
 * Feature = capability inside that business area.
 * Story = one specific user scenario.
 */

test('Admin can log in to OrangeHRM', async ({ page }) => {
  await allure.severity('blocker');
  await allure.epic('Authentication');
  await allure.feature('Login');
  await allure.story('Admin logs in with valid credentials');
  await allure.tags('smoke', 'regression');

  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.locator('input[name="username"]').fill('Admin');
  await page.locator('input[name="password"]').fill('admin123');
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.locator('h6')).toHaveText('Dashboard');
});

test('OrangeHRM login page shows username field', async ({ page }) => {
  await allure.severity('minor');
  await allure.epic('Authentication');
  await allure.feature('Login');
  await allure.story('Login page displays username field');

  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  await expect(page.locator('input[name="username"]')).toBeVisible();
});
