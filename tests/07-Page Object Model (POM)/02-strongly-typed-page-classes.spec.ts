// 02-strongly-typed-page-classes.spec.ts
//
// TOPIC: creating strongly-typed Page classes in TypeScript
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// Open pages/InventoryPage.ts and pages/CheckoutStepOnePage.ts alongside
// this file. Every locator is typed `Locator`, every method has an
// explicit parameter and return type, and `SortOrder` / `CheckoutInfo`
// are dedicated types instead of loose strings/objects. None of that is
// just documentation — TypeScript actively enforces it.

import { test, expect } from '@playwright/test';
import { InventoryPage } from './pages/InventoryPage';
import { LoginPage } from './pages/LoginPage';
import { CheckoutStepOnePage } from './pages/CheckoutStepOnePage';

test('typed return values can be used directly, no casting or parsing needed', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);

  // getProductNames() is typed Promise<string[]>, so `.length` and
  // `.includes(...)` below are known to be valid by the compiler — no
  // runtime surprise if the method's return type ever changed shape.
  const productNames = await inventoryPage.getProductNames();
  expect(productNames.length).toBe(6);
  expect(productNames).toContain('Sauce Labs Backpack');

  // getProductCount() is typed Promise<number>, so this arithmetic
  // comparison is safe without an explicit Number(...) conversion.
  const count = await inventoryPage.getProductCount();
  expect(count).toBe(productNames.length);
});

test('a union type restricts a method to only its valid values', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);

  // sortBy()'s parameter type is 'az' | 'za' | 'lohi' | 'hilo' (see
  // InventoryPage.ts's `SortOrder` type). Uncommenting the line below
  // would be a TypeScript ERROR, caught before the test ever runs:
  //
  //   await inventoryPage.sortBy('low-to-high');
  //   //                          ^ Argument of type '"low-to-high"' is not
  //   //                            assignable to parameter of type 'SortOrder'.
  //
  // That's a real typo class eliminated at compile time instead of showing
  // up as a confusing runtime failure from selectOption().
  await inventoryPage.sortBy('lohi');

  await expect(inventoryPage.sortDropdown).toHaveValue('lohi');
});

test('a typed parameter object prevents mixing up field order', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addProductToCart('Sauce Labs Backpack');
  await inventoryPage.header.goToCart();
  await page.locator('[data-test="checkout"]').click();

  const checkoutStepOnePage = new CheckoutStepOnePage(page);

  // CheckoutInfo is a named object type, so the caller can't accidentally
  // swap positions the way three loose string parameters would allow
  // (e.g. fillInfo('Doe', 'Jane', '12345') passing last-name-first by
  // mistake) — every field is explicitly labeled at the call site.
  await checkoutStepOnePage.fillInfo({
    firstName: 'Jane',
    lastName: 'Doe',
    postalCode: '12345',
  });
  await checkoutStepOnePage.continueToOverview();

  await expect(page).toHaveURL(/checkout-step-two\.html/);
});
