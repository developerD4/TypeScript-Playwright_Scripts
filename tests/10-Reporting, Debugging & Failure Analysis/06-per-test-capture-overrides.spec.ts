// 06-per-test-capture-overrides.spec.ts
//
// TOPIC: configuring screenshot and video capture on test failure
// (continued) — overriding the project-level default for one file
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// test.use({ screenshot, video }) overrides playwright.config.ts's
// project-level defaults ('only-on-failure' / 'retain-on-failure' — see
// file 05) for every test in THIS file, without changing behavior
// anywhere else in the suite.
//
// IMPORTANT: test.use() with screenshot/video MUST be called at the TOP
// LEVEL of a test file — not nested inside a test.describe() block —
// because changing these options forces Playwright to start a dedicated
// worker process for the tests that use them. That's why this override
// lives in its own file rather than a describe block inside file 05.

import { test, expect } from '@playwright/test';

test.use({ screenshot: 'on', video: 'on' });

test('this test passes, but still gets a screenshot captured', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);

  // Nothing else to do here — the screenshot/video capture happens during
  // TEARDOWN, after this test function returns (see the afterEach below
  // for how to confirm that), not as something the test body triggers
  // itself.
});

test('a second passing test in this file also gets one, same override applies', async ({
  page,
}) => {
  await page.goto('https://www.saucedemo.com');
  await expect(page.locator('.login_logo')).toBeVisible();
});

test.afterEach(async ({}, testInfo) => {
  // testInfo.attachments is only populated once the test function has
  // fully returned and Playwright's fixture teardown has run — which is
  // exactly when this afterEach hook fires. Checking inside the test body
  // itself (before returning) would find nothing yet, even though capture
  // did happen.
  //
  // Unlike file 05's default ('only-on-failure'), `screenshot: 'on'` here
  // attaches a screenshot for BOTH tests above even though they passed —
  // proving the file-level override took effect, not just the project
  // default.
  const screenshotAttachment = testInfo.attachments.find((a) => a.name === 'screenshot');
  expect(screenshotAttachment).toBeTruthy();
});

// When you'd actually want this: temporarily flipping `screenshot`/`video`
// to 'on' for one file while investigating a specific intermittently
// flaky test locally, then reverting to the project default (or deleting
// the override) once you're done — 'on' for the WHOLE suite would slow
// every run down and fill test-results/ with mostly-unneeded video files
// for tests that were passing anyway.
