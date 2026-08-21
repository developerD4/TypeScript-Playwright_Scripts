// 04-dynamic-elements-and-ids.spec.ts
//
// TOPIC: Handling dynamic elements and unstable/auto-generated IDs
//
// Sites used:
//   https://the-internet.herokuapp.com/dynamic_loading/1 and /2 — content
//     that only appears after a delay, good for practicing that
//     Playwright auto-waits (no manual sleeps needed).
//   https://www.saucedemo.com — its "Add to cart" buttons have
//     PREDICTABLE, attribute-based ids (e.g. add-to-cart-sauce-labs-backpack)
//     instead of random ones, which is exactly the pattern to prefer over
//     truly unstable ids like "ember482" or "react-select-3-input".

import { test, expect } from '@playwright/test';

test('waiting for a dynamically loaded element (hidden, then shown)', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');

  await page.getByRole('button', { name: 'Start' }).click();

  // No manual wait needed: Playwright auto-waits when you assert. Just
  // express the intent clearly and give it a generous timeout since the
  // demo intentionally takes a few seconds to "load".
  await expect(page.locator('#finish')).toHaveText('Hello World!', { timeout: 10000 });
});

test('waiting for an element that is added to the DOM (not just unhidden)', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');

  // This is a trickier variant: the element doesn't exist in the DOM at
  // all until loading finishes (rather than existing but hidden).
  // expect().toBeVisible() still auto-waits for it correctly either way.
  await page.getByRole('button', { name: 'Start' }).click();
  await expect(page.locator('#finish')).toBeVisible({ timeout: 10000 });
});

test('avoid brittle dynamic IDs — prefer a stable, predictable attribute pattern', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // AVOID hardcoding a single opaque id if you just want "the first
  // add-to-cart button on the page":
  //   const bad = page.locator('#add-to-cart-sauce-labs-backpack'); // fragile if the product changes

  // PREFER matching the stable, predictable PREFIX every button shares.
  // This survives the product list being reordered or a product being
  // renamed, as long as the id-naming convention itself doesn't change.
  const firstAddToCartButton = page.locator('[id^="add-to-cart-"]').first();

  await expect(firstAddToCartButton).toBeVisible();
  await firstAddToCartButton.click();

  // After adding, SauceDemo swaps the button's id/text to a matching
  // "remove-" prefix — another predictable, attribute-based pattern.
  await expect(page.locator('[id^="remove-"]').first()).toBeVisible();
});
