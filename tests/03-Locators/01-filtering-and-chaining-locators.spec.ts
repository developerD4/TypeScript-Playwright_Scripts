import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {

  // Open SauceDemo
  await page.goto('https://www.saucedemo.com');

  // Login
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Verify login
  await expect(page).toHaveURL(/inventory.html/);
});


test('Find a product using its name', async ({ page }) => {

  // Find the product card by product name
  const product = page
    .locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Backpack' });

  // Verify that the product was found
  await expect(product).toHaveCount(1);

  // Click Add to Cart inside that product
  await product.getByRole('button', { name: 'Add to cart' }).click();

  // Verify product was added
  await expect(
    product.getByRole('button', { name: 'Remove' })
  ).toBeVisible();
});


test('Find a product using an element inside it', async ({ page }) => {

  // Find the product card containing the Add to Cart button
  const product = page
    .locator('.inventory_item')
    .filter({
      has: page.locator(
        '[data-test="add-to-cart-sauce-labs-bike-light"]'
      )
    });

  // Verify the product name
  await expect(
    product.locator('.inventory_item_name')
  ).toHaveText('Sauce Labs Bike Light');
});


test('Find an element inside the shopping cart', async ({ page }) => {

  // Add Backpack to cart
  await page
    .locator('[data-test="add-to-cart-sauce-labs-backpack"]')
    .click();

  // Open shopping cart
  await page.locator('.shopping_cart_link').click();

  // Find the cart section
  const cart = page.locator('.cart_list');

  // Find Remove button only inside the cart
  const removeButton = cart.getByRole('button', { name: 'Remove' });

  // Verify Remove button is available
  await expect(removeButton).toBeVisible();

  // Remove the product
  await removeButton.click();

  // Verify product was removed
  await expect(removeButton).not.toBeVisible();
});


test('Find product and add it to cart', async ({ page }) => {

  // Find the product by its name
  const product = page
    .locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Onesie' });

  // Click Add to Cart inside the product
  await product.getByRole('button', { name: 'Add to cart' }).click();

  // Verify cart count
  await expect(
    page.locator('.shopping_cart_badge')
  ).toHaveText('1');
});