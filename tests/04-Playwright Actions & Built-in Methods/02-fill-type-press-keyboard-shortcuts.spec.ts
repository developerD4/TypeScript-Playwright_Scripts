import { test, expect } from '@playwright/test';

// -------------------- fill() --------------------

test('Enter text using fill()', async ({ page }) => {

  await page.goto('https://opensource-demo.orangehrmlive.com');

  // Enter username and password
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');

  // Verify entered values
  await expect(page.getByPlaceholder('Username')).toHaveValue('Admin');
  await expect(page.getByPlaceholder('Password')).toHaveValue('admin123');
});


// -------------------- pressSequentially() --------------------

test('Type text character by character', async ({ page }) => {

  await page.goto('https://opensource-demo.orangehrmlive.com');

  // Type username one character at a time
  await page.getByPlaceholder('Username')
    .pressSequentially('Admin');

  // Verify entered value
  await expect(page.getByPlaceholder('Username'))
    .toHaveValue('Admin');
});


// -------------------- press() --------------------

test('Press a keyboard key', async ({ page }) => {

  await page.goto('https://opensource-demo.orangehrmlive.com');

  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');

  // Press Enter to login
  await page.getByPlaceholder('Password').press('Enter');

  // Verify login
  await expect(page).toHaveURL(/dashboard/);
});


// -------------------- Keyboard Shortcut --------------------

test('Use keyboard shortcut', async ({ page }) => {

  await page.goto('https://opensource-demo.orangehrmlive.com');

  const username = page.getByPlaceholder('Username');

  await username.fill('Admin');

  // Select all text
  await username.press('Control+A');

  // Delete the selected text
  await username.press('Backspace');

  // Verify field is empty
  await expect(username).toHaveValue('');
});
