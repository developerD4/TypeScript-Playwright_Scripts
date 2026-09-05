import { test, expect } from '@playwright/test';

// ==================== FULL PAGE SCREENSHOT ====================

test('Check full page screenshot', async ({ page }) => {

  await page.goto('https://playwrightlab.github.io/');

  // Take screenshot and compare with saved screenshot
  await expect(page).toHaveScreenshot('home-page.png', {
    fullPage: true
  });
});

// ==================== ELEMENT SCREENSHOT ====================

test('Check element screenshot', async ({ page }) => {

  await page.goto('https://playwrightlab.github.io/');

  // Locate an element
  const heading = page.getByRole('heading').first();

  // Take screenshot of only this element
  await expect(heading).toHaveScreenshot('heading.png');
});