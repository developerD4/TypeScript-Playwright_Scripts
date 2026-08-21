// 07-multi-page-navigation-flow.spec.ts
//
// TOPIC: managing multi-page navigation flows within a single test scenario
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// A realistic user journey crosses several distinct pages: login → product
// list → cart → checkout (info) → checkout (review) → confirmation. Each
// page gets its OWN page object, and the test simply hands off from one to
// the next as navigation happens — the test reads as a story of the flow,
// while every page's own details stay encapsulated in its own class.

import { test, expect } from './fixtures/pages.fixture';

test('full purchase flow across six distinct pages', async ({
  page,
  loginPage,
  inventoryPage,
  cartPage,
  checkoutStepOnePage,
  checkoutStepTwoPage,
  checkoutCompletePage,
}) => {
  // 1. Login page
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory\.html/);

  // 2. Inventory (product list) page
  await inventoryPage.addProductToCart('Sauce Labs Backpack');
  await inventoryPage.addProductToCart('Sauce Labs Bike Light');
  expect(await inventoryPage.header.getCartCount()).toBe(2);

  // 3. Hand off to the cart page
  await inventoryPage.header.goToCart();
  await expect(page).toHaveURL(/cart\.html/);
  expect(await cartPage.getItemNames()).toEqual(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);

  // 4. Hand off to checkout step one (shipping info)
  await cartPage.proceedToCheckout();
  await expect(page).toHaveURL(/checkout-step-one\.html/);
  await checkoutStepOnePage.fillInfo({
    firstName: 'Jane',
    lastName: 'Doe',
    postalCode: '12345',
  });
  await checkoutStepOnePage.continueToOverview();

  // 5. Hand off to checkout step two (order review)
  await expect(page).toHaveURL(/checkout-step-two\.html/);
  const totalText = await checkoutStepTwoPage.getTotalText();
  expect(totalText).toMatch(/^Total: \$\d+\.\d{2}$/);
  await checkoutStepTwoPage.finish();

  // 6. Hand off to the final confirmation page
  await expect(page).toHaveURL(/checkout-complete\.html/);
  const confirmationText = await checkoutCompletePage.getConfirmationText();
  expect(confirmationText).toBe('Thank you for your order!');
});

test('a shorter flow: remove an item from the cart before checking out', async ({
  page,
  loginPage,
  inventoryPage,
  cartPage,
}) => {
  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await inventoryPage.addProductToCart('Sauce Labs Backpack');
  await inventoryPage.addProductToCart('Sauce Labs Onesie');
  await inventoryPage.header.goToCart();

  await expect(page).toHaveURL(/cart\.html/);
  await cartPage.removeItem('Sauce Labs Onesie');

  expect(await cartPage.getItemNames()).toEqual(['Sauce Labs Backpack']);
  expect(await cartPage.header.getCartCount()).toBe(1);
});
