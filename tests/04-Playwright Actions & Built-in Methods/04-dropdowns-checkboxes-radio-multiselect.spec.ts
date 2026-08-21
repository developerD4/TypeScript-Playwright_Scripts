// 04-dropdowns-checkboxes-radio-multiselect.spec.ts
//
// TOPIC: dropdowns (single <select>), checkboxes, radio buttons, multi-select lists
//
// Sites used:
//   - https://the-internet.herokuapp.com/dropdown  (see sites.txt #2) — single select
//   - https://the-internet.herokuapp.com/checkboxes (see sites.txt #2) — checkboxes
//   - https://demoqa.com/radio-button  (see sites.txt #7) — radio buttons
//   - https://demoqa.com/select-menu  (see sites.txt #7) — native multi-select

import { test, expect } from '@playwright/test';

test('selectOption() picks one item from a native dropdown', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dropdown');

  const dropdown = page.locator('#dropdown');
  await expect(dropdown).toHaveValue(''); // "Please select an option" placeholder

  // You can select by visible label...
  await dropdown.selectOption({ label: 'Option 1' });
  await expect(dropdown).toHaveValue('1');

  // ...or by the option's underlying value attribute.
  await dropdown.selectOption('2');
  await expect(dropdown).toHaveValue('2');
});

test('checkboxes: check the current state before toggling', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');

  const checkboxes = page.locator('#checkboxes input[type="checkbox"]');
  await expect(checkboxes).toHaveCount(2);

  await checkboxes.nth(0).check();
  await checkboxes.nth(1).uncheck();

  await expect(checkboxes.nth(0)).toBeChecked();
  await expect(checkboxes.nth(1)).not.toBeChecked();
});

test('radio buttons: only one option in a group can be selected at a time', async ({ page }) => {
  await page.goto('https://demoqa.com/radio-button');

  // These radios are styled with Bootstrap, which visually hides the native
  // <input> and shows a custom circle instead. check() still works because
  // Playwright clicks the associated <label>, exactly like a real user would.
  const yesRadio = page.locator('#yesRadio');
  const impressiveRadio = page.locator('#impressiveRadio');

  await yesRadio.check();
  await expect(yesRadio).toBeChecked();
  await expect(page.getByText('You have selected Yes')).toBeVisible();

  // Selecting a different radio in the same group deselects the first one.
  await impressiveRadio.check();
  await expect(impressiveRadio).toBeChecked();
  await expect(yesRadio).not.toBeChecked();

  // The "No" radio is disabled on this page — Playwright's check() would
  // fail against it, and toBeDisabled() lets us assert that on purpose.
  await expect(page.locator('#noRadio')).toBeDisabled();
});

test('multi-select: selectOption() with an array picks several items at once', async ({ page }) => {
  await page.goto('https://demoqa.com/select-menu');

  const carsMultiSelect = page.locator('#cars');

  // Passing an array selects multiple <option>s in one call. Any options
  // NOT listed here are deselected, so this call fully controls the result.
  await carsMultiSelect.selectOption(['volvo', 'audi']);

  const selectedValues = await carsMultiSelect.evaluate((select: HTMLSelectElement) =>
    Array.from(select.selectedOptions).map((option) => option.value)
  );
  expect(selectedValues.sort()).toEqual(['audi', 'volvo']);
});
