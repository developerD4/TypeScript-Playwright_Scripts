// 03-drag-and-drop-and-mouse-movement.spec.ts
//
// TOPIC: drag-and-drop, and low-level mouse movement
//
// Site used: https://the-internet.herokuapp.com/drag_and_drop (see sites.txt #2)
//   Two boxes, A and B. Dragging one onto the other swaps their labels.

import { test, expect } from '@playwright/test';

test('locator.dragTo() drags one element onto another', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/drag_and_drop');

  const columnA = page.locator('#column-a');
  const columnB = page.locator('#column-b');

  await expect(columnA.locator('header')).toHaveText('A');
  await expect(columnB.locator('header')).toHaveText('B');

  // dragTo() is the high-level API: it hovers the source, presses the
  // mouse down, moves to the target in steps, then releases — all in one
  // call. It works for both HTML5 drag-and-drop and mouse-based dnd.
  await columnA.dragTo(columnB);

  // The page's JS swaps the two headers' text on drop.
  await expect(columnA.locator('header')).toHaveText('B');
  await expect(columnB.locator('header')).toHaveText('A');
});

test('page.mouse gives low-level control for a manual drag-and-drop', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/drag_and_drop');

  const columnA = page.locator('#column-a');
  const columnB = page.locator('#column-b');

  const sourceBox = await columnA.boundingBox();
  const targetBox = await columnB.boundingBox();
  if (!sourceBox || !targetBox) throw new Error('Could not measure drag elements');

  // Manually replicate what dragTo() does under the hood. Useful when the
  // built-in dragTo() doesn't fit a page's custom drag implementation and
  // you need finer control over the mouse path (e.g. extra intermediate
  // move steps to trigger a "dragover" handler).
  await page.mouse.move(
    sourceBox.x + sourceBox.width / 2,
    sourceBox.y + sourceBox.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + targetBox.height / 2,
    { steps: 10 } // move in 10 incremental steps rather than teleporting
  );
  await page.mouse.up();

  await expect(columnA.locator('header')).toHaveText('B');
  await expect(columnB.locator('header')).toHaveText('A');
});
