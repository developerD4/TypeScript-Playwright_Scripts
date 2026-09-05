import { test, expect } from '@playwright/test';

// ==================== AUTO-RETRYING TEXT ASSERTION ====================

test('Wait for text to appear', async ({ page }) => {

  await page.goto(
    'https://the-internet.herokuapp.com/dynamic_loading/1'
  );

  await page.locator('#start button').click();

  // Playwright keeps checking until the text appears
  await expect(page.locator('#finish'))
    .toHaveText('Hello World!', {
      timeout: 10000
    });
});

// ==================== ELEMENT CREATED LATER ====================

test('Wait for element that appears later', async ({ page }) => {

  await page.goto(
    'https://the-internet.herokuapp.com/dynamic_loading/2'
  );

  await page.locator('#start button').click();

  // The element is created after a few seconds
  // toBeVisible() automatically waits for it
  await expect(page.locator('#finish')).toBeVisible({
    timeout: 10000
  });

  await expect(page.locator('#finish'))
    .toHaveText('Hello World!');
});