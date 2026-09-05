import { test, expect } from '@playwright/test';

// ==================== FULL PAGE SCREENSHOT ====================

test('Take a full page screenshot', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com');

  // Take screenshot of the full page
  await page.screenshot({
    path: 'full-page.png',
    fullPage: true
  });
});

// ==================== ELEMENT SCREENSHOT ====================

test('Take screenshot of an element', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com');

  const heading = page.locator('h1');

  // Take screenshot of the heading
  await heading.screenshot({
    path: 'heading.png'
  });

  // Verify element is visible
  await expect(heading).toBeVisible();
});

// ==================== PDF ====================

test('Save page as PDF', async ({ page, browserName }) => {

  // PDF works only with Chromium
  //Run the PDF test only in Chromium; skip it in Firefox and WebKit.
  test.skip(browserName !== 'chromium');

  await page.goto('https://demo.playwright.dev/todomvc');

  // Save page as PDF
  await page.pdf({
    path: 'todo.pdf',
    format: 'A4'
  });
});

// Firefox and WebKit: Playwright does not provide page.pdf() support for these browser engines.
// Chromium: page.pdf() uses Chromium's built-in PDF generation capability and is supported in headless Chromium.
// page.pdf() works in Chromium when Chromium is running in headless mode.
//Chromium headless has a built-in mechanism that Playwright can use to directly generate a PDF, 
// whereas Firefox/WebKit don't expose the equivalent Playwright API.
//Also, headed Chromium is different because Playwright's page.pdf() is designed for Chromium's   headless PDF-generation path, 
// not for controlling the visible browser's Print dialog.