// 03-dry-principle.spec.ts
//
// TOPIC: applying the DRY principle to avoid repeated logic in test scripts
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// DRY = "Don't Repeat Yourself". The goal isn't "never write similar-looking
// code" — it's "never have the SAME PIECE OF KNOWLEDGE written in more than
// one place." When SauceDemo's login flow changes, you want exactly ONE
// line to fix, not a find-and-replace across every spec file.
//
// This file shows three escalating levels of DRY-ing up repeated login
// logic. Which level is "enough" depends on how many places repeat the
// logic — level 1 code is fine for a single file; level 3 is what you
// reach for once several FILES need the same setup.

import { test, expect, type Page } from '@playwright/test';

// LEVEL 0 (not shown as runnable code — this is what NOT to do):
//
//   test('test A', async ({ page }) => {
//     await page.goto('https://www.saucedemo.com');
//     await page.locator('#user-name').fill('standard_user');
//     await page.locator('#password').fill('secret_sauce');
//     await page.locator('#login-button').click();
//     // ... test A's actual logic
//   });
//   test('test B', async ({ page }) => {
//     await page.goto('https://www.saucedemo.com');
//     await page.locator('#user-name').fill('standard_user');
//     await page.locator('#password').fill('secret_sauce');
//     await page.locator('#login-button').click();
//     // ... test B's actual logic
//   });
//
// Copy-pasted 4 times here; imagine it copy-pasted across 40 tests. The
// day SauceDemo adds a "remember me" checkbox that must be unchecked, or
// changes #login-button's id, someone has to find and fix every copy.

// LEVEL 1: extract a plain helper function — good enough within one file.
async function loginAsStandardUser(page: Page): Promise<void> {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
}

test.describe('level 1: a shared helper function', () => {
  test('standard_user reaches the inventory page', async ({ page }) => {
    await loginAsStandardUser(page);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('standard_user can add an item after logging in', async ({ page }) => {
    await loginAsStandardUser(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });
});

// LEVEL 2: a beforeEach hook — DRY for every test in one describe block,
// with no per-test call needed at all.
test.describe('level 2: beforeEach handles it for every test in this block', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('the inventory page shows all 6 products', async ({ page }) => {
    // No login call here — beforeEach already ran it before this test body.
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });

  test('sorting by price low-to-high works', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('lohi');
  });
});

// LEVEL 3 (not repeated here — already built in this repo's other topic
// folders): a FIXTURE. Once several different FILES all need "a logged-in
// page," a beforeEach in each file still repeats the concept across files.
// framework/fixtures/base-fixtures.ts (see topic 06, at the project root)
// and tests/07-Page Object Model (POM)/fixtures/pages.fixture.ts both solve
// this with test.extend() — the setup is defined ONCE, and any spec file
// gets it just by importing that file's `test` instead of '@playwright/test'.
// Reach for a fixture when a beforeEach would otherwise be copy-pasted
// across multiple spec files, not before that.
