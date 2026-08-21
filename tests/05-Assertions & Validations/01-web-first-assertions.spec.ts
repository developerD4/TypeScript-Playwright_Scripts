// 01-web-first-assertions.spec.ts
//
// TOPIC: web-first assertions — toBeVisible, toHaveText, toHaveValue,
// toBeEnabled, and friends
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// "Web-first" means these assertions know how to wait for the browser
// themselves: expect(locator).toBeVisible() doesn't just check the DOM
// once, it polls the page until the condition is true (or the timeout
// runs out). That's what makes them the right default over reading a
// value once with a plain `expect(await locator.textContent())...`.

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
});

test('toBeVisible / not.toBeVisible — element presence on screen', async ({ page }) => {
  await expect(page.locator('.login_logo')).toBeVisible();
  await expect(page.locator('.error-message-container h3')).not.toBeVisible();
});

test('toHaveText / toContainText — exact vs partial text', async ({ page }) => {
  // toHaveText requires the FULL text to match (whitespace-trimmed).
  await expect(page.locator('.login_logo')).toHaveText('Swag Labs');

  // toContainText only checks that the given text appears somewhere inside.
  await expect(page.locator('.login_credentials')).toContainText('standard_user');
});

test('toHaveValue — current value of an input field', async ({ page }) => {
  const usernameField = page.locator('#user-name');

  await expect(usernameField).toHaveValue('');
  await usernameField.fill('standard_user');
  await expect(usernameField).toHaveValue('standard_user');
});

test('toBeEnabled / toBeDisabled — interactive state of an element', async ({ page }) => {
  const loginButton = page.locator('#login-button');

  // The Login button on SauceDemo is always clickable, even with empty
  // fields (it shows a validation error instead) — this checks that.
  await expect(loginButton).toBeEnabled();

  await page.locator('#user-name').fill('locked_out_user');
  await page.locator('#password').fill('secret_sauce');
  await loginButton.click();

  // A locked-out user gets an error message instead of navigating away.
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toContainText('locked out');
});

test('toHaveCount — number of matching elements', async ({ page }) => {
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('toHaveAttribute / toHaveClass — element attributes and CSS classes', async ({ page }) => {
  const usernameField = page.locator('#user-name');

  await expect(usernameField).toHaveAttribute('placeholder', 'Username');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  const cartBadgeParent = page.locator('.shopping_cart_link');
  await expect(cartBadgeParent).toHaveClass(/shopping_cart_link/);
});

test('toHaveURL / toHaveTitle — page-level assertions, not element-level', async ({ page }) => {
  await expect(page).toHaveTitle('Swag Labs');
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});
