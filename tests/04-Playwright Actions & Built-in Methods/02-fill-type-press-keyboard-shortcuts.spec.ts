import { test, expect } from '@playwright/test';


// -------------------- fill() --------------------

test('Enter text using fill()', async ({ page }) => {

  await page.goto('https://www.saucedemo.com');

  // Enter username and password
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');

  // Verify the entered values
  await expect(page.locator('#user-name'))
    .toHaveValue('standard_user');

  await expect(page.locator('#password'))
    .toHaveValue('secret_sauce');
});


// -------------------- pressSequentially() --------------------

test('Type text character by character', async ({ page }) => {

  await page.goto('https://www.saucedemo.com');

  const username = page.locator('#user-name');

  // Types one character at a time
  await username.pressSequentially('standard_user', {
    delay: 50
  });

  // Verify the text
  await expect(username)
    .toHaveValue('standard_user');
});


// -------------------- press() --------------------

test('Press a keyboard key', async ({ page }) => {

  await page.goto('https://www.saucedemo.com');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');

  // Press Enter to submit the login form
  await page.locator('#password').press('Enter');

  // Verify login
  await expect(page).toHaveURL(/inventory.html/);
});


// -------------------- Keyboard Shortcuts --------------------

test('Use keyboard shortcuts', async ({ page }) => {

  await page.goto('https://www.saucedemo.com');

  const username = page.locator('#user-name');

  await username.fill('standard_user');

  // Select all text
  await username.press('Control+A');

  // Delete selected text
  await username.press('Backspace');

  // Verify field is empty
  await expect(username).toHaveValue('');
});