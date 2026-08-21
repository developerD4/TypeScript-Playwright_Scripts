// 08-avoiding-anti-patterns.spec.ts
//
// TOPIC: avoiding anti-patterns — keeping assertions out of Page Object
// classes
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// This file is less about a new API and more about a rule worth following
// deliberately: every page object in this folder (LoginPage,
// InventoryPage, ...) only ever RETURNS data — text, counts, booleans. Not
// one of them calls `expect(...)` internally. Below is why, plus a few
// other anti-patterns to watch for.

import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

// ANTI-PATTERN 1: assertions baked into the page object
//
//   class LoginPage {
//     async loginAndExpectSuccess(username: string, password: string) {
//       await this.usernameInput.fill(username);
//       await this.passwordInput.fill(password);
//       await this.loginButton.click();
//       await expect(this.page).toHaveURL(/inventory\.html/); // <-- BAD
//     }
//   }
//
// Why this is a problem:
//   - It hides the assertion from the test file, so a reader scanning the
//     test has no idea a check even happened, let alone what it checked.
//   - It can't be reused for a NEGATIVE test (e.g. wrong password) without
//     either duplicating the method or adding awkward parameters/flags to
//     turn the assertion on and off.
//   - A failure reports as "loginAndExpectSuccess failed" instead of a
//     clear "expected URL to match /inventory.html/" — worse debugging
//     signal.
//
// GOOD PATTERN: the page object performs the action and returns data;
// the TEST decides what that data should be.

test('good: LoginPage.login() just acts — the test asserts the outcome', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  // The assertion is right here, visible, specific, and easy to change
  // per test — not buried inside LoginPage.
  await expect(page).toHaveURL(/inventory\.html/);
});

test('good: the SAME login() method is reused for a failure case, unmodified', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'wrong_password');

  // A method that only acts (never asserts) works for BOTH the success
  // and failure paths — no separate "loginAndExpectFailure" needed.
  const errorText = await loginPage.getErrorText();
  expect(errorText).toContain('do not match');
});

// ANTI-PATTERN 2: arbitrary waits baked into a page object
//
//   async addProductToCart(name: string) {
//     await this.page.waitForTimeout(2000); // <-- BAD: guesses a delay
//     await this.addToCartButton(name).click();
//   }
//
// Playwright's own auto-waiting already retries actions until the element
// is ready (see tests/05-Assertions & Validations/03-auto-retrying-assertions.spec.ts).
// A fixed `waitForTimeout` either wastes time waiting longer than needed,
// or — worse — isn't long enough and the test becomes flaky. None of the
// page objects in this folder use `waitForTimeout` anywhere.

test('good: no arbitrary waits needed — actions auto-wait for readiness', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  // This click auto-waits for the button to exist and be actionable; no
  // preceding `waitForTimeout` or `waitForSelector` call was needed.
  await inventoryPage.addProductToCart('Sauce Labs Backpack');

  expect(await inventoryPage.header.getCartCount()).toBe(1);
});

// ANTI-PATTERN 3: hardcoding one test's data inside a shared page object
//
//   async loginAsStandardUser() {                 // <-- BAD: too specific
//     await this.login('standard_user', 'secret_sauce');
//   }
//
// This locks the page object to one particular test's data. A generic
// login(username, password) — like the real LoginPage.ts has — works for
// every user (standard, locked-out, problem, ...) without adding a new
// method per scenario.

test('good: a generic method works for any user, not just one hardcoded one', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('locked_out_user', 'secret_sauce');

  const errorText = await loginPage.getErrorText();
  expect(errorText).toContain('locked out');
});
