import { test, expect } from '@playwright/test';
import { config } from '../../framework/config/env';

test('read the selected environment configuration', () => {
  expect(['dev', 'qa', 'staging', 'production']).toContain(config.env);
  expect(config.baseURL).toContain('orangehrmlive.com');
  expect(config.username).not.toBe('');
});

test('use environment values to log in', async ({ page }) => {
  await page.goto(config.baseURL);
  await page.locator('input[name="username"]').fill(config.username);
  await page.locator('input[name="password"]').fill(config.password);
  await page.locator('button[type="submit"]').click();

  await expect(page).toHaveURL(/dashboard/);
});

// Flow: .env.qa -> dotenv -> config -> this test -> OrangeHRM.
