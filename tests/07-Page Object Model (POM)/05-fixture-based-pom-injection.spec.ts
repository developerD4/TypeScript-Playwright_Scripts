// 05-fixture-based-pom-injection.spec.ts
//
// TOPIC: fixture-based POM injection using test.extend() instead of
// manual instantiation
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// Note the import below: `test`/`expect` come from ./fixtures/pages.fixture,
// NOT from '@playwright/test'. Compare this file to
// 01-pom-principles-separating-locators-actions.spec.ts, which manually
// wrote `const loginPage = new LoginPage(page);` in every test — here,
// `loginPage`/`inventoryPage`/etc. just show up as extra parameters,
// already constructed.

import { test, expect } from './fixtures/pages.fixture';

test('page objects arrive pre-built — no "new LoginPage(page)" in sight', async ({
  loginPage,
  inventoryPage,
}) => {
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  const products = await inventoryPage.getProductNames();
  expect(products.length).toBe(6);
});

test('only ask for the fixtures a given test actually needs', async ({ loginPage }) => {
  // This test only destructures `loginPage` — `inventoryPage`, `cartPage`,
  // etc. are never constructed for it at all. Fixtures are created lazily,
  // only when a test actually asks for them.
  await loginPage.open();
  await loginPage.login('standard_user', 'wrong_password');

  const errorText = await loginPage.getErrorText();
  expect(errorText).toContain('do not match');
});

test('every page-object fixture can be combined in one test, same as any other fixture', async ({
  loginPage,
  inventoryPage,
  cartPage,
}) => {
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await inventoryPage.addProductToCart('Sauce Labs Backpack');
  await inventoryPage.header.goToCart();

  const cartItems = await cartPage.getItemNames();
  expect(cartItems).toEqual(['Sauce Labs Backpack']);
});
