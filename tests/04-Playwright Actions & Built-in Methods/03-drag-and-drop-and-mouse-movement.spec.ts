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
// const position = await box.boundingBox();
//boundingBox() gives the position and size of an element on the page. We can use its x and y coordinates with page.mouse when we need to manually control the mouse.
// if (position) {
//   const x = position.x + position.width / 2;
//   const y = position.y + position.height / 2;

//   await page.mouse.move(x, y);
// }

//dragTo() → simple, high-level drag-and-drop.
// page.mouse → low-level mouse control where we manually control the mouse.

// page.mouse.move()
//         ↓
// Move mouse
//         ↓
// page.mouse.down()
//         ↓
// Press and hold
//         ↓
// page.mouse.move()
//         ↓
// Move while holding
//         ↓
// page.mouse.up()
//         ↓
// Release
// | `dragTo()`                           | `page.mouse`                            |
// | ------------------------------------ | --------------------------------------- |
// | High-level action                    | Low-level action                        |
// | Works with locators                  | Works with coordinates                  |
// | Simple to use                        | More control                            |
// | `boxA.dragTo(boxB)`                  | `move → down → move → up`               |
// | Recommended for normal drag-and-drop | Used when you need manual mouse control |

// Drawing on a canvas - Signature/drawing pad, Paint application, Graph/chart interaction
// Mouse-based games or applications - Move an object, Click/drag on a specific screen position
// Testing custom mouse interactions - Press and hold, Move while holding, Release
