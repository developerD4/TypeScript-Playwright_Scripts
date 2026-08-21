// 05-resolving-strict-mode-violations.spec.ts
//
// TOPIC: Resolving strict-mode violations when a locator matches
//        multiple elements
//
// Playwright's "strict mode" throws an error if a locator that expects
// ONE element actually matches MULTIPLE elements. This forces you to be
// explicit instead of accidentally interacting with the wrong one.
//
// Site used: https://www.saucedemo.com — its inventory page has 6
// products, and every single one has an "Add to cart" button with the
// exact same visible text. That's a perfect, guaranteed way to trigger
// (and then fix) a strict-mode violation.

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);
});

test('the problem: a locator matching multiple elements throws in strict mode', async ({ page }) => {
  const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });

  // Confirms the setup: this locator really does match more than one
  // element, which is exactly what causes the strict-mode error below.
  await expect(addToCartButtons).toHaveCount(6);

  // Calling an action (like .click()) on a locator matching 6 elements
  // throws: "strict mode violation: ... resolved to 6 elements".
  await expect(addToCartButtons.click()).rejects.toThrow(/strict mode violation/);
});

test('fix 1: narrow the locator by scoping to a specific parent container', async ({ page }) => {
  const backpackCard = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Backpack' });

  await backpackCard.getByRole('button', { name: 'Add to cart' }).click();
  await expect(backpackCard.getByRole('button', { name: 'Remove' })).toBeVisible();
});

test('fix 2: use .first(), .last(), or .nth() when you genuinely want one by position', async ({ page }) => {
  const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });

  await addToCartButtons.first().click();   // the first product on the page
  // await addToCartButtons.last().click(); // the last product on the page
  // await addToCartButtons.nth(2).click(); // the 3rd product (0-indexed)

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

test('fix 3 (usually best): use filter() to disambiguate by content instead of position', async ({ page }) => {
  // Filtering by an attribute or text keeps working correctly even if the
  // product list gets reordered — unlike fix 2, which depends on position.
  const bikeLightButton = page
    .getByRole('button', { name: 'Add to cart' })
    .and(page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]'));

  await bikeLightButton.click();
  await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toBeVisible();
});

test('verifying element count before acting (defensive check)', async ({ page }) => {
  const cards = page.locator('[data-test="inventory-item"]');

  // Useful when you WANT to assert how many matches exist — e.g.
  // confirming a filter/search produced the expected number of results —
  // rather than acting on any one of them.
  await expect(cards).toHaveCount(6);
});
