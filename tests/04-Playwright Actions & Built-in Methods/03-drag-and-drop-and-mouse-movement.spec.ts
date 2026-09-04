import { test, expect } from '@playwright/test';

// -------------------- dragTo() --------------------

test('Drag one element to another', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/drag_and_drop');

  const boxA = page.locator('#column-a');
  const boxB = page.locator('#column-b');

  // Verify initial values
  await expect(boxA.locator('header')).toHaveText('A');
  await expect(boxB.locator('header')).toHaveText('B');

  // Drag Box A to Box B
  await boxA.dragTo(boxB);

  // Verify result
  await expect(boxA.locator('header')).toHaveText('B');
  await expect(boxB.locator('header')).toHaveText('A');
});


// -------------------- Mouse Actions --------------------

test('Perform mouse actions', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/drag_and_drop');

  // Move mouse to a position
  await page.mouse.move(100, 200);

  // Press and hold the mouse button
  await page.mouse.down();

  // Move mouse while holding the button
  await page.mouse.move(300, 200);

  // Release the mouse button
  await page.mouse.up();
});
