import { test, expect } from './support/custom-matchers';

test('Use custom matcher', async ({ page }) => {

  await page.goto('https://playwrightlab.github.io/');

  // Get text from the page
  const text = await page.locator('body').innerText();

  // Use our custom matcher
  expect(text).toHaveTextLength(16);
});

//Built-in matchers → use them for normal automation.
// Custom matchers → create your own assertion when the same special validation is repeated across many tests.