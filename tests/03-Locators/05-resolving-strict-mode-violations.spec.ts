import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Open OrangeHRM
  await page.goto(
    'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
  );

  // Login
  await page.getByPlaceholder('Username').fill('Admin');
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByRole('button', { name: 'Login' }).click();

  // Verify login
  await expect(page).toHaveURL(/dashboard/);
});


test('Strict mode problem - multiple elements found', async ({ page }) => {

  // "Admin" can appear in more than one place
  const adminText = page.getByText('Admin', { exact: true });

  // Check how many matching elements are found
  const count = await adminText.count();

  console.log('Admin elements found:', count);

  // If more than one element is found,
  // directly clicking it can cause a strict mode error.
});


test('Fix - use first() when we want the first matching element', async ({ page }) => {

  const menuItems = page.getByRole('link');

  // Select the first link
  const firstLink = menuItems.first();

  // Verify it exists
  await expect(firstLink).toBeVisible();
});


test('Fix - use nth() when we want an element by position', async ({ page }) => {

  const menuItems = page.getByRole('link');

  // Select the second link
  const secondLink = menuItems.nth(1);

  // Verify it exists
  await expect(secondLink).toBeVisible();
});


test('Fix - use a unique locator', async ({ page }) => {

  // Instead of selecting from many links,
  // directly locate the PIM menu item
  const pimMenu = page.getByText('PIM', { exact: true });

  await expect(pimMenu).toBeVisible();

  await pimMenu.click();

  // Verify that PIM page is opened
  await expect(page).toHaveURL(/pim/);
});


test('Check how many elements are found', async ({ page }) => {

  // Find all left-side menu items
  const menuItems = page.locator('.oxd-main-menu-item');

  // Check the number of matching elements
  const count = await menuItems.count();

  console.log('Menu items:', count);

  // Verify that menu items are displayed
  await expect(menuItems.first()).toBeVisible();
});

// `.first()`=> Selects the **first element** from multiple matching elements. Use when the first matching element is the required one. 
// `.last()`=> Selects the **last element** from multiple matching elements. Use when the last matching element is the required one. 
// `.nth(index)`=> Selects an element using its **position**; index starts from `0`. Example: `.nth(1)` selects the second element. 
// `.filter()`=> Narrows down multiple elements using **text or another locator**. Useful when you want a specific element based on its content.
// `.and()`=> Combines two locators and returns elements that match **both conditions**. Useful for making a locator more specific.
// `.locator()`=> Searches for an element **inside another element**. Useful for narrowing the search to a specific parent/container.
// `.getByRole()`=> Locates elements using their **accessible role and name**. Often produces more specific and readable locators.
// `.getByText()`=> Locates an element using its **visible text**. Add `{ exact: true }` when you need an exact text match.
// `.getByTestId()` => Locates an element using a **test ID** such as `data-testid`. Very useful when developers provide stable test attributes.
// `.count()`=> Returns the **number of matching elements**. Useful for checking how many elements your locator actually finds.
