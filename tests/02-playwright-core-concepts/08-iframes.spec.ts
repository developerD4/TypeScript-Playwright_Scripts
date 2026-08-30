import { test, expect } from '@playwright/test';

test.describe('Iframes', () => {

  test('Verify element inside iframe', async ({ page }) => {

    await page.goto('https://the-internet.herokuapp.com/iframe');

    // Locate the iframe
    const frame = page.frameLocator('#mce_0_ifr');

    // Locate an element inside the iframe
    const editor = frame.locator('#tinymce');

    // Verify the element
    await expect(editor).toBeVisible();
    await expect(editor).toContainText('Your content goes here.');
  });


  test('Enter text inside iframe', async ({ page }) => {

    await page.goto('https://the-internet.herokuapp.com/iframe');

    // Locate the iframe
    const frame = page.frameLocator('#mce_0_ifr');

    // Locate the text editor inside iframe
    const editor = frame.locator('#tinymce');

    // Enter text
    await editor.fill('Hello from inside the iframe');

    // Verify the entered text
    await expect(editor).toHaveText('Hello from inside the iframe');
  });

});