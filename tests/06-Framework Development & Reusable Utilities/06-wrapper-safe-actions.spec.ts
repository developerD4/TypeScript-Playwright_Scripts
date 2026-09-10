import { test, expect } from '@playwright/test';
import { config } from '../../framework/config/env';
import { CommonActions } from '../../framework/core/safeActions';

test('use common wrappers for a login action', async ({ page }) => {
  const actions = new CommonActions();

  await page.goto(config.baseURL);
  await actions.fillText(page.locator('input[name="username"]'), config.username, 'Username field');
  await actions.fillText(page.locator('input[name="password"]'), config.password, 'Password field');
  await actions.clickElement(page.locator('button[type="submit"]'), 'Login button');

  await expect(page).toHaveURL(/dashboard/);
});

// The wrapper gives common logging and error messages. It does not replace Playwright auto-waiting.
