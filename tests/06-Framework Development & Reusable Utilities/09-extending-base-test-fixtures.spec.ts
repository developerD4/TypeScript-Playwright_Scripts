import { config } from '../../framework/config/env';
import { test, expect } from '../../framework/fixtures/base-fixtures';

test('log in through the custom loginPage fixture', async ({ page, loginPage }) => {
  await loginPage.open();
  await loginPage.login(config.username, config.password);

  await expect(page).toHaveURL(/dashboard/);
});

// Flow: Playwright base test -> test.extend() -> loginPage fixture -> test.
