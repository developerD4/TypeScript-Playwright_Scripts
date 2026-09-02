import { test, expect } from '@playwright/test';


// -------------------- CLICK --------------------

test('Click an element', async ({ page }) => {

  await page.goto('https://demo.playwright.dev/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');

  await input.fill('Buy milk');
  await input.press('Enter');
  // Find the checkbox for Buy milk
  const checkbox = page
    .locator('li', { hasText: 'Buy milk' })
    .getByRole('checkbox');
  // Click the checkbox
  await checkbox.click();

  // Verify that the todo is completed
  await expect(
    page.locator('li', { hasText: 'Buy milk' })
  ).toHaveClass(/completed/);
});
// -------------------- DOUBLE CLICK --------------------

test('Double-click an element', async ({ page }) => {

  await page.goto('https://demo.playwright.dev/todomvc');

  const input = page.getByPlaceholder('What needs to be done?');

  await input.fill('Buy milk');
  await input.press('Enter');

  // Find the todo
  const todo = page.getByText('Buy milk');

  // Double-click the todo
  await todo.dblclick();

  // Verify that edit mode is opened
  const editBox = page.locator('li.editing .edit');

  await expect(editBox).toBeVisible();
  await expect(editBox).toHaveValue('Buy milk');
});


// -------------------- HOVER --------------------

test('Hover over an element', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/hovers');

  // Find the first user
  const user = page.locator('.figure').first();

  // Find the profile link
  const profileLink = user.getByRole('link', {
    name: 'View profile'
  });

  // Link is hidden before hover
  await expect(profileLink).not.toBeVisible();

  // Hover over the user
  await user.hover();

  // Link becomes visible
  await expect(profileLink).toBeVisible();
});


// -------------------- CHECK / UNCHECK --------------------

test('Check and uncheck a checkbox', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/checkboxes');

  const checkbox1 = page.locator('#checkboxes input').nth(0);
  const checkbox2 = page.locator('#checkboxes input').nth(1);

  // Check the first checkbox
  await checkbox1.check();

  await expect(checkbox1).toBeChecked();

  // Uncheck the second checkbox
  await checkbox2.uncheck();

  await expect(checkbox2).not.toBeChecked();
});