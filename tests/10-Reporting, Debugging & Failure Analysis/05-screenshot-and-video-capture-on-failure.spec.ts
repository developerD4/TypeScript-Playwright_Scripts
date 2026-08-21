// 05-screenshot-and-video-capture-on-failure.spec.ts
//
// TOPIC: configuring screenshot and video capture on test failure
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// playwright.config.ts sets, for every project in this repo:
//   use: {
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//   }
//
// Both settings share the same shape of options:
//   'off'                — never capture (fastest, nothing to look at afterward)
//   'on'                 — capture for every test, always, pass or fail
//   'only-on-failure'    — (screenshot) capture one image, only for failing tests
//   'retain-on-failure'  — (video) always records, but the file is only KEPT if the test failed
//
// `retain-on-failure` for video (rather than `on-failure`, which doesn't
// exist as a video option) reflects that video recording has to start
// before you know whether the test will fail — so it always records, and
// Playwright deletes the recording afterward for tests that passed.
//
// See 06-per-test-capture-overrides.spec.ts (same folder) for how to
// override these project-level defaults for one specific test/file.

import { test, expect } from '@playwright/test';

test('captures a screenshot automatically when a test fails', async ({ page }) => {
  // test.fail() tells Playwright this test is EXPECTED to fail. If it
  // fails (as it's designed to, below), Playwright reports it as an
  // "expected failure" — shown as passed in the summary — instead of
  // breaking the suite. This lets this file demonstrate REAL on-failure
  // capture without leaving a genuinely broken test behind.
  test.fail();

  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Deliberately wrong — SauceDemo has 6 products, not 999. This failure
  // is what triggers the screenshot capture configured above.
  await expect(page.locator('.inventory_item')).toHaveCount(999);
});

test.afterEach(async ({}, testInfo) => {
  // Only relevant right after the intentionally-failing test above:
  // testInfo.attachments already contains the auto-captured screenshot by
  // the time this afterEach runs — proving the config setting actually
  // did something, not just that it's present in the config file. (The
  // video attachment isn't reliably available yet at this point in the
  // SAME test's afterEach, since it only finalizes once the browser
  // context fully closes after the test — you'd check it via the trace/
  // HTML report instead, see files 01 and 02 in this folder.)
  if (testInfo.title.includes('captures a screenshot automatically')) {
    const screenshotAttachment = testInfo.attachments.find((a) => a.name === 'screenshot');
    expect(screenshotAttachment).toBeTruthy();
    expect(screenshotAttachment?.path).toBeTruthy();
  }
});

test('manual capture: page.screenshot() for a specific moment, independent of pass/fail', async ({
  page,
}, testInfo) => {
  // Automatic on-failure capture happens once, at the END of a test.
  // Sometimes you want a screenshot of one SPECIFIC intermediate moment
  // regardless of how the test ultimately finishes — call page.screenshot()
  // directly and attach it yourself (see topic 10, file 01, for more on
  // testInfo.attach()).
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  const midFlowScreenshot = await page.screenshot();
  await testInfo.attach('after-login.png', { body: midFlowScreenshot, contentType: 'image/png' });

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  const afterAddToCartScreenshot = await page.screenshot();
  await testInfo.attach('after-add-to-cart.png', {
    body: afterAddToCartScreenshot,
    contentType: 'image/png',
  });

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});
