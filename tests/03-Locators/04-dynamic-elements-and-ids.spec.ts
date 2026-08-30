import { test, expect } from '@playwright/test';


test('Handle an element that appears after loading', async ({ page }) => {

  await page.goto(
    'https://the-internet.herokuapp.com/dynamic_loading/1'
  );

  // Click Start
  await page.getByRole('button', { name: 'Start' }).click();

  // Playwright waits automatically for the text to appear
  await expect(
    page.locator('#finish')
  ).toHaveText('Hello World!', { timeout: 10000 });
});


test('Handle an element added to the page later', async ({ page }) => {

  await page.goto(
    'https://the-internet.herokuapp.com/dynamic_loading/2'
  );

  // Click Start
  await page.getByRole('button', { name: 'Start' }).click();

  // Playwright waits until the element appears
  await expect(
    page.locator('#finish')
  ).toBeVisible({ timeout: 10000 });
});


test('Handle dynamic IDs using a stable pattern', async ({ page }) => {

  await page.goto('https://www.saucedemo.com');

  // Login
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Find an Add to Cart button using a common ID pattern
  const addButton = page
    .locator('[id^="add-to-cart-"]')
    .first();

  // Verify and click the button
  await expect(addButton).toBeVisible();
  await addButton.click();

  // Verify that the button changed to Remove
  const removeButton = page
    .locator('[id^="remove-"]')
    .first();

  await expect(removeButton).toBeVisible();
});