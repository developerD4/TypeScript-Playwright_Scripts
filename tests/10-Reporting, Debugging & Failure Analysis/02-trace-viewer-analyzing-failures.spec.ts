// 02-trace-viewer-analyzing-failures.spec.ts
//
// TOPIC: using Trace Viewer to analyze failed test execution step-by-step
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// A trace is a recorded timeline of everything Playwright did during a
// test: every action, a DOM snapshot before/after each one, network
// requests, console output, and (with `sources: true`) the exact line of
// test code that ran. Trace Viewer lets you scrub through that timeline
// AFTER the run, instead of only seeing a final pass/fail.
//
// This repo already captures traces automatically via
// `trace: 'on-first-retry'` in playwright.config.ts — a trace is only
// saved for a test that fails and then gets retried, since that's when
// you actually need one (saving one for every passing test would be a lot
// of wasted disk space). Common alternatives for the same setting:
//   'off'              — never record (fastest, but nothing to debug with)
//   'on'                — record for every test, always
//   'retain-on-failure' — record every test, but only KEEP the file if it failed
//   'on-first-retry'    — this repo's setting: only record during a retry attempt
//
// To open a saved trace:
//   npx playwright show-trace path/to/trace.zip
// or drag-and-drop the .zip file onto https://trace.playwright.dev

import { test, expect } from '@playwright/test';

test('manually recording a trace for one specific risky section of a test', async ({
  context,
  page,
}, testInfo) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);

  // context.tracing gives manual start/stop control, useful when you only
  // want a detailed recording around one specific, failure-prone
  // sequence — rather than the whole test — to keep the trace file small
  // and focused.
  await context.tracing.start({
    screenshots: true, // capture a screenshot alongside each action
    snapshots: true, // capture a full DOM snapshot before/after each action (what makes the timeline scrubbable)
    sources: true, // capture the test source file, so Trace Viewer can show which line ran
  });

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="firstName"]').fill('Jane');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();

  const tracePath = testInfo.outputPath('checkout-flow-trace.zip');
  await context.tracing.stop({ path: tracePath });

  // In a real debugging session you'd now run:
  //   npx playwright show-trace "<tracePath>"
  // and scrub through exactly the six actions recorded above, inspecting
  // each one's before/after DOM snapshot and network activity.
  const fs = await import('fs');
  expect(fs.existsSync(tracePath)).toBe(true);
  expect(fs.statSync(tracePath).size).toBeGreaterThan(0);

  await expect(page).toHaveURL(/checkout-step-two\.html/);
});

test('what to look for once a trace is open in Trace Viewer', async ({ page }) => {
  // This test doesn't demonstrate NEW code — it's a checklist for reading
  // a trace once you have one open, referenced here so it lives next to
  // the code that produces one.
  //
  // 1. Timeline (top strip) — click any action to jump the DOM snapshot
  //    below to exactly that moment. Red-highlighted entries are the
  //    ones that failed.
  // 2. "Before"/"After" snapshot tabs — for a failing click, the "Before"
  //    snapshot often reveals the real problem: the element existed but
  //    was covered by something else, or the page hadn't finished loading.
  // 3. Action list (left panel) — each Playwright API call, with its
  //    duration; a surprisingly long gap between two actions is often the
  //    real root cause of a "flaky" timeout.
  // 4. Network tab — every request/response during the test, useful for
  //    spotting a slow or failed API call the UI was silently waiting on.
  // 5. Console tab — page console.log/warn/error output, exactly as the
  //    browser saw it, which is different from the TEST's own console.log
  //    (that goes to the HTML report instead — see file 01).
  // 6. Source tab (only if `sources: true` was set) — the exact test code
  //    line executing at the selected point in the timeline.
  await page.goto('https://www.saucedemo.com');
  await expect(page.locator('.login_logo')).toBeVisible();
});

// Reference: where to find a trace this repo already saved automatically.
// After a test FAILS and gets retried (which requires `retries` to be
// configured — see topic 08, file 07, on CI-aware config), Playwright
// writes the trace under:
//   test-results/<test-name>-chromium/trace.zip
// The HTML report (file 01 in this folder) also links directly to it from
// the failed test's page — no manual path-hunting needed in practice.
