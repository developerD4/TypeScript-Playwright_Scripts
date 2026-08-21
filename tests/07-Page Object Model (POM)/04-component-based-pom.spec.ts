// 04-component-based-pom.spec.ts
//
// TOPIC: component-based POM for reusable UI widgets (header, nav bar, modals)
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// Open components/HeaderComponent.ts alongside this file. InventoryPage
// and CartPage each expose a `.header` property that's an instance of the
// SAME HeaderComponent class — the cart icon locator is written once, not
// copy-pasted into both page classes.

import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';

test('the header component works identically from the inventory page...', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  expect(await inventoryPage.header.getCartCount()).toBe(0);

  await inventoryPage.addProductToCart('Sauce Labs Backpack');
  await inventoryPage.addProductToCart('Sauce Labs Bike Light');

  // `inventoryPage.header` — a HeaderComponent, not something InventoryPage
  // had to reimplement itself.
  expect(await inventoryPage.header.getCartCount()).toBe(2);
});

test('...and from the cart page, via the exact same component class', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addProductToCart('Sauce Labs Backpack');
  await inventoryPage.header.goToCart();

  const cartPage = new CartPage(page);
  // Same `.header.getCartCount()` call as the test above, now called on
  // CartPage's HeaderComponent instance instead of InventoryPage's — no
  // duplicated locator or logic between the two page classes.
  expect(await cartPage.header.getCartCount()).toBe(1);

  await cartPage.removeItem('Sauce Labs Backpack');
  expect(await cartPage.header.getCartCount()).toBe(0);
});

test('a component method can drive navigation, like a real header would', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addProductToCart('Sauce Labs Fleece Jacket');

  await inventoryPage.header.goToCart();

  await expect(page).toHaveURL(/cart\.html/);
});
