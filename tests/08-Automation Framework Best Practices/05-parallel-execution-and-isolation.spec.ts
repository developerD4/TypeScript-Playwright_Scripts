// 05-parallel-execution-and-isolation.spec.ts
//
// TOPIC: parallel execution strategy and ensuring proper test/data isolation
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// By default, Playwright runs test FILES in parallel across multiple
// worker processes (`fullyParallel: true` in playwright.config.ts, set in
// this repo), and gives every test its own BrowserContext — so cookies,
// localStorage, and sessionStorage never leak between tests even when
// they run at the exact same time on different workers.

import { test, expect } from '@playwright/test';

test.describe('these three tests are safe to run fully in parallel', () => {
  // Explicit here for teaching purposes — 'parallel' is already the
  // suite-wide default from `fullyParallel: true` in playwright.config.ts,
  // so this line doesn't change behavior, it just documents the intent
  // for whoever reads this file next.
  test.describe.configure({ mode: 'parallel' });

  test('worker A: standard_user logs in successfully', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('worker B: locked_out_user sees an error', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('locked_out_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });

  test('worker C: adding an item only affects THIS test\'s own cart', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // Even though "worker A" above also logs in as standard_user at the
    // same time, this test's cart badge is unaffected by it — each test
    // has its own isolated BrowserContext, so there's no shared
    // client-side state to collide on here.
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });
});

test.describe('when order genuinely matters: test.describe.serial()', () => {
  // Forces these tests to run in this exact order, on the SAME worker,
  // and stops the rest of the block if one fails. Reach for this only
  // when steps are genuinely sequential and re-verifying an earlier step
  // from scratch every time would be wasteful — most suites need this
  // rarely, since it also means these tests can no longer run in
  // parallel with each other.
  test.describe.serial('a deliberately sequential scenario', () => {
    test('step 1: open the site', async ({ page }) => {
      await page.goto('https://www.saucedemo.com');
      await expect(page.locator('.login_logo')).toBeVisible();
    });

    test('step 2: log in (assumes step 1 already ran)', async ({ page }) => {
      // NOTE: this still gets its OWN fresh page/context — `serial` only
      // guarantees ORDER and same-worker execution, not a shared page
      // object between tests. Real cross-test state sharing needs
      // something explicit, like a fixture that persists data at
      // describe-block scope.
      await page.goto('https://www.saucedemo.com');
      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
      await page.locator('#login-button').click();
      await expect(page).toHaveURL(/inventory\.html/);
    });
  });
});

// A note on DATA isolation with a real (non-demo) backend: this file's
// parallel tests are safe because SauceDemo's cart is purely client-side.
// If the app under test stored cart/account state on a SHARED SERVER
// record (e.g. all tests logging into the same one "test@company.com"
// account), running them in parallel could cause one test's action to
// affect another's — the fix is either a unique account/record per test
// (see the idempotency example in 01-test-independence-and-idempotency.spec.ts)
// or a dedicated account per parallel worker, keyed off
// `test.info().parallelIndex`.
