// 07-screenshots-and-pdfs.spec.ts
//
// TOPIC: generating screenshots and PDFs of pages/elements
//
// Sites used:
//   - https://www.saucedemo.com (see sites.txt #3) — full-page & element screenshots
//   - https://demo.playwright.dev/todomvc (see sites.txt #1) — PDF export
//
// Files are written under testInfo.outputPath(), Playwright's per-test
// output folder (inside test-results/), so nothing is left behind in the
// repo itself and each test gets its own isolated folder.

import { test, expect } from '@playwright/test';

test('capture a full-page screenshot', async ({ page }, testInfo) => {
  await page.goto('https://www.saucedemo.com');

  const screenshotPath = testInfo.outputPath('full-page.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const fs = await import('fs');
  expect(fs.existsSync(screenshotPath)).toBe(true);

  // Note: Playwright also has expect(page).toHaveScreenshot(), a *visual
  // comparison* assertion that saves a baseline image on its first run and
  // diffs against it on every run after. It's powerful for catching visual
  // regressions, but needs a checked-in baseline per browser/OS, so it's
  // left out of this beginner example to keep things simple.
});

test('capture a screenshot of a single element', async ({ page }, testInfo) => {
  await page.goto('https://www.saucedemo.com');

  const loginBox = page.locator('.login-box');
  const screenshotPath = testInfo.outputPath('login-box.png');

  // Calling .screenshot() on a locator crops the image to just that
  // element, instead of the whole viewport/page.
  await loginBox.screenshot({ path: screenshotPath });

  await expect(loginBox).toBeVisible();
});

test('export a page as a PDF', async ({ page, browserName }, testInfo) => {
  // page.pdf() is only supported when running headless Chromium.
  test.skip(browserName !== 'chromium', 'PDF generation requires headless Chromium');

  await page.goto('https://demo.playwright.dev/todomvc');

  const pdfPath = testInfo.outputPath('todomvc.pdf');
  await page.pdf({ path: pdfPath, format: 'A4' });

  const fs = await import('fs');
  expect(fs.existsSync(pdfPath)).toBe(true);
  expect(fs.statSync(pdfPath).size).toBeGreaterThan(0);
});
