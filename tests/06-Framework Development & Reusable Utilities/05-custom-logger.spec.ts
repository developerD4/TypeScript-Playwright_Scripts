import { test, expect } from '@playwright/test';
import { logger } from '../../framework/logger/logger';

test('use logger for important test steps', async ({ page }) => {
  logger.info('Opening OrangeHRM login page');
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  logger.warn('This example opens the page but does not create or change any employee data');
  await expect(page.locator('input[name="username"]')).toBeVisible();

  // Use logger.error() inside catch blocks when an important framework step fails.
});
