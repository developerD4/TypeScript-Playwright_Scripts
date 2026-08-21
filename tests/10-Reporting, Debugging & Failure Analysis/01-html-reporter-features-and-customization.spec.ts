// 01-html-reporter-features-and-customization.spec.ts
//
// TOPIC: Playwright's built-in HTML reporter — features and customization options
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// After running this file, open the HTML report to see everything below
// rendered visually:
//   npx playwright test 01-html-reporter --reporter=html
//   npx playwright show-report
//
// The HTML report shows, per test: a timeline of test.step() calls, any
// attachments (screenshots, videos, traces, custom files), console
// output, and — on failure — the exact assertion that failed with an
// expected-vs-actual diff.

import { test, expect } from '@playwright/test';

test('test.step() breaks a test into a labeled, collapsible timeline', async ({ page }) => {
  // In the terminal (list reporter) and especially in the HTML report,
  // each step below appears as its own line/node you can expand — instead
  // of one long opaque test, you get a readable table of contents for
  // what the test actually did, in order.
  await test.step('open SauceDemo', async () => {
    await page.goto('https://www.saucedemo.com');
  });

  await test.step('log in as standard_user', async () => {
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
  });

  await test.step('verify the inventory page loaded', async () => {
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_item')).toHaveCount(6);
  });
});

test('nested test.step() calls show up as nested rows in the report', async ({ page }) => {
  await test.step('checkout flow', async () => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await test.step('add an item to the cart', async () => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    });

    await test.step('proceed to checkout', async () => {
      await page.locator('.shopping_cart_link').click();
      await page.locator('[data-test="checkout"]').click();
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });
  });
});

test('testInfo.attach() adds a custom file to the report, beyond screenshots/video', async ({
  page,
}, testInfo) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Attach arbitrary data — here, a JSON snapshot of some page state —
  // that shows up as a downloadable/viewable attachment on this test's
  // page in the HTML report. Useful for API response bodies, generated
  // test data, or anything else worth keeping alongside the result.
  const productNames = await page.locator('.inventory_item_name').allTextContents();
  await testInfo.attach('inventory-product-names.json', {
    body: JSON.stringify(productNames, null, 2),
    contentType: 'application/json',
  });

  // Attachments aren't limited to text — a manually-captured screenshot
  // at a specific moment (not just the automatic on-failure one) is just
  // as valid.
  const screenshotBuffer = await page.screenshot();
  await testInfo.attach('inventory-page.png', {
    body: screenshotBuffer,
    contentType: 'image/png',
  });

  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('console output and page errors are captured into the report automatically', async ({
  page,
}) => {
  // No special code needed for this one — console.log() calls made by the
  // TEST (not the page) show up in the HTML report's "Log" section for
  // this test automatically.
  console.log('Starting login flow for HTML reporter demo');

  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  console.log('Login flow complete');
  await expect(page).toHaveURL(/inventory\.html/);
});

// Customization reference — see playwright.config.ts's `reporter` array:
//
//   reporter: [
//     ['list'],                                                    // plain console output while tests run
//     ['html', { outputFolder: 'playwright-report', open: 'never' }],
//   ],
//
// Common `html` reporter options (second element of the tuple):
//   outputFolder  — where the report's files are written (default: 'playwright-report')
//   open          — 'always' | 'never' | 'on-failure' (default) — whether
//                   `npx playwright test` auto-opens the report in a browser when it finishes
//   host / port   — pin `npx playwright show-report` to a specific address instead of a random port
//
// Other reporters worth knowing (swap/add into the same array):
//   'dot'    — one character per test, minimal terminal output — good for CI logs
//   'json'   — machine-readable results, e.g. for a custom dashboard
//   'junit'  — XML format many CI systems (Jenkins, GitLab, Azure DevOps) can natively display
//
// Multiple reporters can run at once (as configured here) — e.g. 'list'
// for a human watching the terminal live, 'html' for a shareable report
// afterward, and 'junit' for CI to parse — all from the same test run.
