// 01-pom-principles-separating-locators-actions.spec.ts
//
// TOPIC: POM principles — separating locators and actions from
// test/assertion logic
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// The core idea of the Page Object Model: a test file should read like a
// list of steps and checks ("log in, then expect this"), NOT contain the
// raw CSS selectors and low-level Playwright calls needed to perform those
// steps. Those live in a separate class — a "page object" — instead.

import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('without POM — locators and actions mixed into the test itself', () => {
  test('logs in using raw locators written inline', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');

    // If #user-name's id ever changes, or the login flow gains a step,
    // EVERY test file that logs in has to be found and fixed individually.
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory\.html/);
  });
});

test.describe('with POM — locators and actions live in LoginPage, not here', () => {
  test('logs in using the LoginPage page object', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    // The test itself now only orchestrates ("open, login") and asserts —
    // it never has to know that the username field's id is "#user-name".
    // If SauceDemo's markup changes, only LoginPage.ts needs an edit.
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('the same page object is reused for a failure-path test', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'wrong_password');

    // getErrorText() hands back raw data; THIS test decides what counts as
    // pass/fail — see 08-avoiding-anti-patterns.spec.ts for why that split
    // matters.
    const errorText = await loginPage.getErrorText();
    expect(errorText).toContain('do not match');
  });
});
