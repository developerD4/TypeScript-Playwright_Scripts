// 02-soft-vs-hard-assertions.spec.ts
//
// TOPIC: soft assertions vs hard assertions, and when to use each
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// HARD assertions (the normal `expect(...)`) throw immediately on failure
// and stop the test right there — any code after a failed hard assertion
// never runs. This is the right default: once a precondition is wrong,
// continuing usually just produces confusing follow-on failures.
//
// SOFT assertions (`expect.soft(...)`) record a failure but let the test
// keep running, so you can see ALL the problems from one run instead of
// fixing them one at a time across repeated runs. The test is still
// reported as failed overall if any soft assertion failed — Playwright
// fails it at the end automatically.

import { test, expect } from '@playwright/test';

test('hard assertions stop the test at the first failure', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // If this next line fails, nothing below it executes — appropriate here
  // because every other assertion in this test depends on having actually
  // reached the inventory page.
  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('.title')).toHaveText('Products');
});

test('soft assertions collect independent checks across a page in one run', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);

  // These checks are independent of each other — a failure on one doesn't
  // invalidate the next, so soft assertions let a single test run report
  // every broken header element instead of just the first one. If, say,
  // toHaveText below failed, the test would still go on to check the cart
  // icon and item count, and only THEN be reported as failed overall —
  // with all three results visible in the same run instead of only the
  // first failure.
  await expect.soft(page.locator('.title')).toHaveText('Products');
  await expect.soft(page.locator('.shopping_cart_link')).toBeVisible();
  await expect.soft(page.locator('.inventory_item')).toHaveCount(6);
});

test('mixing both: hard-assert a precondition, then soft-assert the details', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Hard assertion for the thing everything else depends on...
  await expect(page).toHaveURL(/inventory\.html/);

  const firstProduct = page.locator('.inventory_item').first();

  // ...then soft assertions for a batch of unrelated details on that
  // product card, so one bad detail doesn't hide the others.
  await expect.soft(firstProduct.locator('.inventory_item_name')).toBeVisible();
  await expect.soft(firstProduct.locator('.inventory_item_price')).toBeVisible();
  await expect.soft(firstProduct.getByRole('button', { name: 'Add to cart' })).toBeEnabled();
});
