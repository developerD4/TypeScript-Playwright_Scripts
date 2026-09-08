import { test, expect } from './support/custom-matchers';

test('Use custom matcher', async ({ page }) => {

  await page.goto('https://playwrightlab.github.io/');

  // Get text from an element
  const text = await page.locator('h1').innerText();

  console.log(text);

  // Check the length of the text
  expect(text).toHaveTextLength(text.length);
});

//Built-in matchers → use them for normal automation.
// Custom matchers → create your own assertion when the same special validation is repeated across many tests.
// Example: E-commerce — Product Price Validation
// import { test } from "@playwright/test";
// import { expect } from "./support/custom-matchers";
// test("Verify product price", async ({ page }) => {
//   await page.goto("https://example.com");
//   const price = page.locator(".product-price");
//   await expect(price).toBeWithinPriceRange(70000, 90000);
// });
//another example
// import { test, expect } from './support/custom-matchers';
// test('Verify success message', async ({ page }) => {
//   await page.goto('https://playwrightlab.github.io/');
//   // Example message from the application
//   const message = 'User created successfully';
//   // Use our custom matcher
//   expect(message).toBeSuccessMessage();
// });
