import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type FrameworkFixtures = {
  loginPage: LoginPage;
};

// Add one useful object to Playwright's normal test fixtures.
export const test = base.extend<FrameworkFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});

export { expect };
