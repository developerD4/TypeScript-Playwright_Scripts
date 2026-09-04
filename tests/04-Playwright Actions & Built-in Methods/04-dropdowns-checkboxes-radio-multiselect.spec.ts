import { test, expect } from '@playwright/test';

// -------------------- DROPDOWN --------------------

test('Select an option from dropdown', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/dropdown');

  const dropdown = page.locator('#dropdown');

  // Select Option 1
  await dropdown.selectOption('1');

  // Verify selected option
  await expect(dropdown).toHaveValue('1');
});

// -------------------- CHECKBOX --------------------

test('Check and uncheck checkbox', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/checkboxes');

  const checkbox1 = page.locator('#checkboxes input').nth(0);
  const checkbox2 = page.locator('#checkboxes input').nth(1);

  // Check first checkbox
  await checkbox1.check();

  // Uncheck second checkbox
  await checkbox2.uncheck();

  // Verify checkbox state
  await expect(checkbox1).toBeChecked();
  await expect(checkbox2).not.toBeChecked();
});


// -------------------- RADIO BUTTON --------------------

test('Select a radio button', async ({ page }) => {

  await page.goto('https://demoqa.com/radio-button');

  const yesRadio = page.locator('#yesRadio');
  const impressiveRadio = page.locator('#impressiveRadio');

  // Select Yes
  await yesRadio.check();

  // Verify Yes is selected
  await expect(yesRadio).toBeChecked();

  // Select Impressive
  await impressiveRadio.check();

  // Verify Impressive is selected
  await expect(impressiveRadio).toBeChecked();

  // Yes should now be unselected
  await expect(yesRadio).not.toBeChecked();
});

// -------------------- MULTI-SELECT --------------------

test('Select multiple options', async ({ page }) => {

  await page.goto('https://demoqa.com/select-menu');

  const cars = page.locator('#cars');

  // Select multiple cars
  await cars.selectOption(['volvo', 'audi']);

  // Verify selected options
  await expect(cars).toHaveValues(['volvo', 'audi']);
});