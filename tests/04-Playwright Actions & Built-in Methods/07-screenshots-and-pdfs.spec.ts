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
  test.skip(browserName !== 'chromium');

  await page.goto('https://demo.playwright.dev/todomvc');

  // Save page as PDF
  await page.pdf({
    path: 'todo.pdf',
    format: 'A4'
  });
});