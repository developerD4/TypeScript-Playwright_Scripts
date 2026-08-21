// 05-attaching-screenshots-videos-logs.spec.ts
//
// TOPIC: attaching screenshots, videos, and logs to individual Allure test results
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// Playwright's OWN screenshot/video/trace capture (configured in
// playwright.config.ts — see topic 10) already gets attached to the
// html/list reporters automatically. allure-playwright captures the same
// artifacts too, but this file focuses on the cases where you want
// something attached to the ALLURE result SPECIFICALLY, on your own
// terms — a manual screenshot at a chosen moment, a full trace, or a
// plain-text log — rather than only what Playwright captures by default.
//
// See 06-attaching-video-recordings.spec.ts (same folder) for the video
// case specifically — it needs a file-level `test.use({ video: 'on' })',
// which can't share a file with the tests below (see that file for why).

import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

test('attaching a manually-captured screenshot at a specific moment', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Playwright's automatic screenshot (topic 10, file 05) only fires on
  // FAILURE, at the end. This captures the inventory page specifically,
  // regardless of whether the test goes on to pass or fail afterward.
  const screenshot = await page.screenshot({ fullPage: true });
  await allure.attachment('inventory-page.png', screenshot, 'image/png');

  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('attaching a plain-text log built up during the test', async ({ page }) => {
  // A running log of what THIS test did, independent of Playwright's own
  // console capture — useful for a custom, readable narrative distinct
  // from raw console.log output, e.g. summarizing business-level steps
  // rather than technical ones.
  const log: string[] = [];
  const record = (line: string) => log.push(`[${new Date().toISOString()}] ${line}`);

  record('Navigating to SauceDemo');
  await page.goto('https://www.saucedemo.com');

  record('Logging in as standard_user');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  record('Verifying inventory page loaded');
  await expect(page).toHaveURL(/inventory\.html/);
  record('Test complete');

  await allure.attachment('test-log.txt', log.join('\n'), 'text/plain');
});

test.describe('attaching a trace file for one specific test', () => {
  test('records and attaches its own trace, independent of the global trace setting', async ({
    context,
    page,
  }, testInfo) => {
    // See tests/10-Reporting, Debugging & Failure Analysis/02-trace-viewer-analyzing-failures.spec.ts
    // for the full explanation of manual context.tracing.start()/stop() —
    // this test reuses that same mechanic, but then attaches the result
    // to Allure specifically with allure.attachTrace(), instead of just
    // leaving it as a file for Playwright's own reporters.
    await context.tracing.start({ screenshots: true, snapshots: true });

    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    const tracePath = testInfo.outputPath('trace.zip');
    await context.tracing.stop({ path: tracePath });

    await allure.attachTrace('login-flow-trace', tracePath);

    await expect(page).toHaveURL(/inventory\.html/);
  });
});
