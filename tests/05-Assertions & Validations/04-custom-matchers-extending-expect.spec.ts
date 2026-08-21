// 04-custom-matchers-extending-expect.spec.ts
//
// TOPIC: writing custom matchers and extending Playwright's expect
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// The matchers themselves live in ./support/custom-matchers.ts — note that
// `test` and `expect` are imported from THAT file below, not from
// '@playwright/test' directly. That file's `expect` is Playwright's
// original expect PLUS our two additions, so every built-in matcher
// (toBeVisible, toHaveText, ...) still works exactly as before.

import { test, expect } from './support/custom-matchers';

test('toBeWithinRange() — a simple synchronous custom matcher', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  const priceText = await page.locator('.inventory_item_price').first().textContent();
  const price = Number(priceText?.replace('$', ''));

  // Reads naturally at the call site, which is the whole point of a custom
  // matcher — this expresses "a plausible SauceDemo product price" better
  // than a raw `expect(price).toBeGreaterThan(0)` / `toBeLessThan(100)` pair.
  expect(price).toBeWithinRange(1, 100);
});

test('toHaveItemCount() — a custom matcher that auto-retries like a built-in one', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  const products = page.locator('.inventory_item');

  // Behaves like toHaveCount(): it polls until the count matches instead
  // of checking once, so it isn't flaky against elements that render in
  // asynchronously.
  await expect(products).toHaveItemCount(6);

  await products.first().getByRole('button', { name: 'Add to cart' }).click();

  // Built-in matchers from the base expect() still work as normal, since
  // our custom expect() only adds to them, never replaces them.
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});
