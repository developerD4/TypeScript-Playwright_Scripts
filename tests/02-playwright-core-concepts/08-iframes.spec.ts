import { test, expect } from '@playwright/test';

/**
 * 8. Working with iframes and nested frames
 *
 * An <iframe> embeds a separate HTML document inside the page. Elements
 * inside it are NOT found by page.locator() directly — you first get a
 * FrameLocator scoped to the iframe, then locate inside that.
 */

test.describe('08 - Iframes and nested frames', () => {
  test('locate an element inside an iframe using frameLocator', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/iframe');

    // frameLocator() targets the <iframe> by its CSS selector; everything
    // chained after it searches WITHIN that frame's document, not the
    // top-level page.
    const editorFrame = page.frameLocator('#mce_0_ifr');
    const editorBody = editorFrame.locator('#tinymce');

    await expect(editorBody).toBeVisible();
    await expect(editorBody).toContainText('Your content goes here.');
  });

  test('you can still act on elements inside the frame like normal', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/iframe');

    const editorFrame = page.frameLocator('#mce_0_ifr');
    const editorBody = editorFrame.locator('#tinymce');

    // Clear and type — auto-waiting still applies inside frames too.
    await editorBody.click();
    await page.keyboard.press('Control+A');
    await editorBody.fill('Hello from inside the iframe');

    await expect(editorBody).toHaveText('Hello from inside the iframe');
  });
});

// Mini-exercise: use page.frames() (not frameLocator) to list every frame
// on the page and log each one's url() to the console.
