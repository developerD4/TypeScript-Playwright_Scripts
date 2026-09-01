import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {

  // Open SauceDemo
  await page.goto('https://www.saucedemo.com');

  // Login
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory.html/);
});

test('Strict mode problem - multiple elements found', async ({ page }) => {

  // There are 6 Add to Cart buttons
  const buttons = page.getByRole('button', { name: 'Add to cart' });
  // Verify that 6 buttons exist
  await expect(buttons).toHaveCount(6);
  // Clicking all 6 at once causes a strict mode error
  await expect(buttons.click()).rejects.toThrow();
});

test('Fix - find the correct product using filter()', async ({ page }) => {
  // Find the Backpack product
  const backpack = page
    .locator('[data-test="inventory-item"]')
    .filter({ hasText: 'Sauce Labs Backpack' });

  // Click Add to Cart only inside Backpack
  await backpack
    .getByRole('button', { name: 'Add to cart' })
    .click();

  // Verify it was added
  await expect(
    backpack.getByRole('button', { name: 'Remove' })
  ).toBeVisible();
});


test('Fix - use first(), last(), or nth()', async ({ page }) => {

  const buttons = page.getByRole('button', { name: 'Add to cart' });

  // Click the first Add to Cart button
  await buttons.first().click();

  // Verify product was added
  await expect(
    page.locator('.shopping_cart_badge')
  ).toHaveText('1');
});


test('Fix - use a unique locator', async ({ page }) => {

  // Find the exact Bike Light button
  const bikeLight = page.locator(
    '[data-test="add-to-cart-sauce-labs-bike-light"]'
  );

  await bikeLight.click();

  // Verify it was added
  await expect(
    page.locator('[data-test="remove-sauce-labs-bike-light"]')
  ).toBeVisible();
});


test('Check how many elements are found', async ({ page }) => {

  const products = page.locator('[data-test="inventory-item"]');

  // Verify that 6 products are displayed
  await expect(products).toHaveCount(6);
});