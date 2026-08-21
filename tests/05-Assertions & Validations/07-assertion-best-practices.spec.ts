// 07-assertion-best-practices.spec.ts
//
// TOPIC: assertion best practices — what and how much to assert per test
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// This file is less about a new API and more about HOW to use the ones
// from the earlier files well. Each test below demonstrates one guideline.

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);
});

// GUIDELINE 1: assert the OUTCOME a user would notice, not implementation
// details. Prefer a visible, meaningful state over checking things like
// internal class names or attributes nobody but the code cares about.
test('good: assert user-visible outcome of adding an item to the cart', async ({ page }) => {
  await page.locator('.inventory_item').first().getByRole('button', { name: 'Add to cart' }).click();

  // This is what a real user would actually look at to confirm it worked.
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

// GUIDELINE 2: one test, one behavior. Keep each test focused on a single
// scenario so that when it fails, the failure tells you exactly what broke
// — instead of a giant end-to-end test where a failure could mean almost
// anything.
test('good: a focused test for a single behavior — removing a cart item', async ({ page }) => {
  await page.locator('.inventory_item').first().getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  await page.locator('.inventory_item').first().getByRole('button', { name: 'Remove' }).click();

  // Only the thing this test is actually about: the badge disappears once
  // the cart is empty again.
  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});

// GUIDELINE 3: don't over-assert. Checking every attribute of every
// element makes tests brittle (they break on unrelated, harmless changes)
// and harder to read (the important assertion gets buried). Assert enough
// to be confident, not everything that's technically checkable.
test('good: a handful of meaningful assertions, not an exhaustive dump', async ({ page }) => {
  const firstItem = page.locator('.inventory_item').first();

  await expect(firstItem.locator('.inventory_item_name')).toBeVisible();
  await expect(firstItem.locator('.inventory_item_price')).toContainText('$');
  await expect(firstItem.getByRole('button', { name: 'Add to cart' })).toBeEnabled();

  // NOT asserted here, deliberately: exact font size, CSS class list,
  // image alt text wording, DOM nesting depth, etc. — none of that is
  // what this test is actually verifying, and asserting on it anyway
  // would make the test fail on unrelated future changes.
});

// GUIDELINE 4: assert on stable, meaningful selectors/values, not on
// things likely to change for unrelated reasons (like exact wording of
// marketing copy) unless that wording IS the point of the test.
test('good: match with a pattern for text that might reasonably vary in wording', async ({
  page,
}) => {
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('.shopping_cart_link').click();

  // A regex tolerates minor copy changes ("Remove" vs "REMOVE") while
  // still catching a real regression (the button disappearing entirely).
  await expect(page.getByRole('button', { name: /remove/i })).toBeVisible();
});

// GUIDELINE 5: prefer specific matchers over generic ones — they produce
// clearer failure messages and double as documentation of intent.
test('good: use the specific matcher for what you mean', async ({ page }) => {
  const cartLink = page.locator('.shopping_cart_link');

  // Prefer this — the failure message says "expected visible, got hidden".
  await expect(cartLink).toBeVisible();

  // Over the vaguer equivalent below, which is technically correct but
  // gives a less informative failure message when it breaks:
  // expect(await cartLink.isVisible()).toBe(true);
});
