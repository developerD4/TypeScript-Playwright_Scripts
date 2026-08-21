// 06-attaching-video-recordings.spec.ts
//
// TOPIC: attaching screenshots, videos, and logs to individual Allure test
// results (continued) — video specifically
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// IMPORTANT: test.use({ video: ... }) MUST be called at the TOP LEVEL of a
// test file, not nested inside a test.describe() block — the same rule
// covered in tests/10-Reporting, Debugging & Failure Analysis/06-per-test-capture-overrides.spec.ts.
// That's why video gets its own file here, separate from 05's screenshot/
// log/trace examples.

import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { readFileSync } from 'fs';

test.use({ video: 'on' });

test('attaches its own recorded video after the browser context finishes writing it', async ({
  page,
}) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await expect(page).toHaveURL(/inventory\.html/);
});

test.afterEach(async ({ page }) => {
  // page.video() is available as soon as recording starts, but its
  // .path() only RESOLVES once the browser context has finished writing
  // the file to disk — which happens as part of Playwright's own fixture
  // teardown, just before this afterEach runs. Calling .path() any
  // earlier (e.g. inside the test body itself) would hang until that
  // teardown completes anyway.
  const video = page.video();
  if (video) {
    const videoPath = await video.path();
    await allure.attachment('login-flow.webm', readFileSync(videoPath), {
      contentType: 'video/webm',
    });
  }
});
