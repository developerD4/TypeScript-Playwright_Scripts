// 01-filtering-and-chaining-locators.spec.ts
//
// TOPIC: Chaining and filtering locators using .filter(), has, hasText
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//   A fake e-commerce site made for test automation practice. It has a
//   product list, each product in its own repeating card — exactly the
//   kind of "many similar elements" situation where filtering matters.
//
// Login: standard_user / secret_sauce (shown on the SauceDemo login page)

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);
});

test('filter a list of products by visible text using hasText', async ({ page }) => {
  // page.locator('.inventory_item') matches ALL 6 product cards on the page.
  // .filter({ hasText }) narrows that down to only the card(s) containing
  // the given text — a very common beginner need: "find the row for X".
  const backpackCard = page
    .locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Backpack' });

  await expect(backpackCard).toHaveCount(1);
  await backpackCard.getByRole('button', { name: 'Add to cart' }).click();

  // The button inside that one card now reads "Remove" — proof we clicked
  // the right card, not just the first one on the page.
  await expect(backpackCard.getByRole('button', { name: 'Remove' })).toBeVisible();
});

test('filter using a nested locator with "has"', async ({ page }) => {
  // "has" filters parent elements based on whether they CONTAIN a specific
  // CHILD locator — not text. Here we find the one product card that
  // contains the "Sauce Labs Bike Light" add-to-cart button.
  const bikeLightCard = page
    .locator('.inventory_item')
    .filter({ has: page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]') });

  await expect(bikeLightCard).toBeVisible();
  await expect(bikeLightCard.locator('.inventory_item_name')).toHaveText('Sauce Labs Bike Light');
});

test('chaining locators to scope a search', async ({ page }) => {
  // Chaining = calling .locator() again on an existing locator.
  // This SCOPES the search to only inside that parent element, which
  // avoids accidentally matching a similarly-named element elsewhere.
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart\.html/);

  const cartSection = page.locator('.cart_list');
  const removeButton = cartSection.getByRole('button', { name: 'Remove' });

  await expect(removeButton).toHaveCount(1);
  await removeButton.click();
  await expect(cartSection.getByRole('button', { name: 'Remove' })).toHaveCount(0);
});

test('combining filter() with hasText and a nested role locator', async ({ page }) => {
  // Real-world pattern: find the row for a specific product, then click
  // a button that only exists inside that row.
  const mugCard = page
    .locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Onesie' });

  await mugCard.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});
