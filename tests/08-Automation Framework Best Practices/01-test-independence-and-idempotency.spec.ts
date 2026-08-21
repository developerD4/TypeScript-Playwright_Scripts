// 01-test-independence-and-idempotency.spec.ts
//
// TOPIC: ensuring test independence and idempotency across the suite
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//            https://automationexercise.com/login (see sites.txt #4)
//
// INDEPENDENT means: any test can run alone, or in any order relative to
// the others, and still pass. IDEMPOTENT means: running the exact same
// test again (same day, same data, a hundred times in a row) still passes
// — it doesn't depend on leftover state from a previous run.
//
// Playwright already gives you a head start here: every test gets its own
// fresh BrowserContext (separate cookies, localStorage, cache) by default,
// so tests can't accidentally see each other's login session. The
// remaining independence/idempotency risks are ones YOU can still
// introduce — this file shows the two most common ones.

import { test, expect } from '@playwright/test';

// ANTI-PATTERN: sharing mutable state at module scope between tests.
//
//   let cartHasItemsAlready = false;   // <-- BAD: lives across tests
//
//   test('adds an item to the cart', async ({ page }) => {
//     ...
//     cartHasItemsAlready = true;
//   });
//
//   test('checks the cart has one item', async ({ page }) => {
//     // Only passes if the PREVIOUS test happened to run first and
//     // succeeded. Run this test alone (`test.only` or a direct file
//     // path), or let Playwright reorder/parallelize them across workers,
//     // and it breaks — a classic "works on my machine, fails in CI" bug.
//     expect(cartHasItemsAlready).toBe(true);
//   });

test.describe('good: each test fully sets up its own state', () => {
  test('adding one item shows a cart count of 1', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // This test never assumes anything about what ran before it — it logs
    // in and adds its own item. Run it alone, run it a thousand times in a
    // row, or run it in parallel with every other test in this file: the
    // result is identical every time.
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('adding two different items shows a cart count of 2', async ({ page }) => {
    // A completely separate login + setup, even though it repeats the
    // same three lines as the test above. That repetition is a DRY
    // concern (see 03-dry-principle.spec.ts for how to remove it) — NOT
    // an independence concern. Independence and "don't repeat yourself"
    // are different goals, and sometimes pull in different directions.
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });
});

test.describe('idempotency: safe to run the exact same test over and over', () => {
  test('signing up with a freshly-generated email succeeds every run', async ({ page }) => {
    // A hardcoded email here would only work the FIRST time this test
    // runs — automationexercise.com rejects a signup with an email that's
    // already registered, so re-running the same test (locally, or on the
    // next CI run) would fail with "email already exists", even though
    // nothing is actually broken. Generating a fresh email per run makes
    // the test idempotent — safe to execute any number of times.
    const uniqueEmail = `qa.user.${Date.now()}.${Math.floor(Math.random() * 10000)}@example.com`;

    await page.goto('https://automationexercise.com/login');
    await page.locator('[data-qa="signup-name"]').fill('Jane Doe');
    await page.locator('[data-qa="signup-email"]').fill(uniqueEmail);
    await page.locator('[data-qa="signup-button"]').click();

    await expect(page).toHaveURL(/signup/);
    await expect(page.locator('input[name="name"]')).toHaveValue('Jane Doe');
  });

  test('resetting app state avoids depending on cart state left by earlier runs', async ({
    page,
  }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // SauceDemo's "Reset App State" menu option clears the cart. In a real
    // app with a server-side account, the equivalent move is usually a
    // dedicated test account (or an API call) reset before/after each
    // run, so a test never inherits state a PREVIOUS run happened to
    // leave behind.
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('[data-test="reset-sidebar-link"]').click();

    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });
});
