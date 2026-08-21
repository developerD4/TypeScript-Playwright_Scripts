// 03-base-page-common-methods.spec.ts
//
// TOPIC: Building a Base Page class with common reusable methods
// (navigate, waitForLoad)
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// Open pages/BasePage.ts alongside this file. LoginPage and InventoryPage
// both `extends BasePage` and get goto()/waitForLoad()/getTitle()/
// getCurrentUrl() for free — neither page class had to redeclare them.

import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

test('goto() is defined once in BasePage, used by every page object', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // LoginPage.open() internally calls this.goto('/') — inherited from
  // BasePage, not redefined in LoginPage itself.
  await loginPage.open();

  expect(await loginPage.getCurrentUrl()).toBe('https://www.saucedemo.com/');
});

test('the same inherited methods work identically from a different page class', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  // InventoryPage never declares getCurrentUrl() or getTitle() itself —
  // it inherits both from BasePage exactly like LoginPage does.
  await inventoryPage.waitForLoad();

  expect(await inventoryPage.getCurrentUrl()).toContain('/inventory.html');
  expect(await inventoryPage.getTitle()).toBe('Swag Labs');
});

test('goto() accepts a path, so any page object can navigate directly', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);

  // Not a realistic flow (you'd normally log in first) — this just shows
  // that goto('/inventory.html') resolves against BASE_URL exactly the
  // same way regardless of which page object calls it.
  await inventoryPage.goto('/inventory.html');

  // SauceDemo doesn't redirect an unauthenticated visit; it stays on the
  // URL and shows an access-denied message instead — proving the
  // navigation itself worked, even though access was denied.
  expect(await inventoryPage.getCurrentUrl()).toBe('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('[data-test="error"]')).toContainText('You can only access');
});
