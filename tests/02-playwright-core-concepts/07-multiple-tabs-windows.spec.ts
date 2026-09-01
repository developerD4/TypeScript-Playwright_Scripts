// import { test, expect } from '@playwright/test';

// import { test, expect } from '@playwright/test';

// test('Handle a new tab', async ({ page, context }) => {

//   // Open the first tab
//   await page.goto('https://the-internet.herokuapp.com/windows');

//   // Wait for the new tab and click the link
//   const newTab = await Promise.all([
//     context.waitForEvent('page'),
//     page.getByRole('link', { name: 'Click Here' }).click()
//   ]).then(result => result[0]);

//   // Wait for the new tab to load
//   await newTab.waitForLoadState();

//   // Verify the new tab
//   await expect(newTab.locator('h3'))
//     .toHaveText('New Window');

//   // Verify the original tab
//   await expect(page.locator('h3'))
//     .toHaveText('Opening a new window');
// });


//Explanation -`waitForEvent()` tells Playwright to wait until a specific event happens and then gives us the related object/data.**

// Example:
// const newTab = await context.waitForEvent('page');

// | Event        | Simple explanation                                |
// | ------------ | ------------------------------------------------- |
// | `'page'`     | Waits for a **new tab/page** to open.             |
// | `'request'`  | Waits for a **network request** to be sent.       |
// | `'response'` | Waits for a **network response** to come back.    |
// | `'close'`    | Waits for a **page or browser context to close**. |

//Wait until a new tab opens → capture that new tab → store it in `newTab`.

// newTab.waitForLoadState() → Waits until the newly opened tab finishes loading before 
// we interact with or verify its elements.

import { test, expect } from '@playwright/test';
test('Handle multiple tabs', async ({ page, context }) => {
  // Open the first page
  await page.goto('https://the-internet.herokuapp.com/windows');
  // Wait for the new tab while clicking the link
  const newTabPromise = context.waitForEvent('page');
  await page.getByRole('link', { name: 'Click Here' }).click();
  const secondTab = await newTabPromise;
  await secondTab.waitForLoadState();
  // Get all open pages/tabs
  const tabs = context.pages();
  // There should be 2 tabs
  expect(tabs.length).toBe(2);
  // First tab
  const firstTab = page;
  // Check the first tab
  await expect(firstTab.locator('h3'))
    .toHaveText('Opening a new window');
  // Check the new tab
  await expect(secondTab.locator('h3'))
    .toHaveText('New Window');
});