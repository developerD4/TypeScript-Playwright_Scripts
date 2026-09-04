import { test, expect } from '@playwright/test';

// -------------------- CLICK --------------------

test('Click', async ({ page }) => {

  await page.goto('https://demo.playwright.dev/todomvc');

  // Add a todo
  await page.getByPlaceholder('What needs to be done?').fill('Buy milk');
  await page.getByPlaceholder('What needs to be done?').press('Enter');

  // Click the checkbox
  await page.getByRole('checkbox').click();

  // Verify todo is completed
  await expect(page.locator('li')).toHaveClass(/completed/);
});


// -------------------- DOUBLE CLICK --------------------

test('Double Click', async ({ page }) => {

  await page.goto('https://demo.playwright.dev/todomvc');

  // Add a todo
  await page.getByPlaceholder('What needs to be done?').fill('Buy milk');
  await page.getByPlaceholder('What needs to be done?').press('Enter');

  // Double-click the todo
  await page.getByText('Buy milk').dblclick();

  // Verify edit box is visible
  await expect(page.locator('.edit')).toBeVisible();
});


// -------------------- HOVER --------------------

test('Hover', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/hovers');
  const user = page.locator('.figure').first();
  // Hover over the user
  await user.hover();
  // title → title="help icon" Typically shown by the browser as a tooltip on hover.
  // data-tooltip → data-tooltip="Custom tooltip text" A custom attribute that stores tooltip text.
  // toHaveText() → checks text inside an element.
  // toHaveAttribute() → checks a value stored in an HTML attribute.

  // Verify profile link is visible
  await expect(user.getByRole('link', { name: 'View profile' }))
    .toBeVisible();
});


// -------------------- CHECK / UNCHECK --------------------

test('Check and Uncheck', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/checkboxes');

  const checkbox1 = page.locator('#checkboxes input').nth(0);
  const checkbox2 = page.locator('#checkboxes input').nth(1);

  // Check the first checkbox
  await checkbox1.check();

  // Verify it is checked
  await expect(checkbox1).toBeChecked();

  // Uncheck the second checkbox
  await checkbox2.uncheck();

  // Verify it is unchecked
  await expect(checkbox2).not.toBeChecked();
});