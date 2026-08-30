import { test, expect } from '@playwright/test';

test('Find and click a button inside Shadow DOM', async ({ page }) => {

  // Open the page
  await page.goto('https://practice.expandtesting.com/shadowdom');

  // Find the Shadow DOM host
  const shadowHost = page.locator('#shadow-host');

  // Find the button inside Shadow DOM
  const button = shadowHost.locator('#my-btn');

  // Verify the button
  await expect(button).toHaveText(
    'This button is inside a Shadow DOM.'
  );

  // Click the button
  await button.click();
});

test('Find the correct element by scoping to Shadow DOM', async ({ page }) => {

  // Open the page
  await page.goto('https://practice.expandtesting.com/shadowdom');

  // There are two elements with the same ID
  await expect(
    page.locator('#my-btn')
  ).toHaveCount(2);

  // Search only inside the Shadow DOM
  const shadowButton = page
    .locator('#shadow-host')
    .locator('#my-btn');

  // Now only one button is found
  await expect(shadowButton).toHaveCount(1);
});