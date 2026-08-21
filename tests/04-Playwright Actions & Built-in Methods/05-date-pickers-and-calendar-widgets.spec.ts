// 05-date-pickers-and-calendar-widgets.spec.ts
//
// TOPIC: interacting with a calendar-style date picker widget
//
// Site used: https://demoqa.com/date-picker (see sites.txt #7)
//   Clicking the date input opens a react-datepicker calendar overlay
//   instead of accepting typed text directly.

import { test, expect } from '@playwright/test';

test('pick a date from the calendar popup by clicking a day cell', async ({ page }) => {
  await page.goto('https://demoqa.com/date-picker');

  const dateInput = page.locator('#datePickerMonthYearInput');

  // Clicking the input opens the calendar overlay (it does not become a
  // normal free-text field, so typing into it is unreliable — clicking
  // through the widget is the robust approach).
  await dateInput.click();

  const calendar = page.locator('.react-datepicker');
  await expect(calendar).toBeVisible();

  // Pick the 15th of the currently-shown month. The calendar renders faded
  // "outside month" days too (e.g. the last days of the previous month), so
  // we exclude those to avoid picking the wrong month's 15th.
  await calendar
    .locator('.react-datepicker__day--015:not(.react-datepicker__day--outside-month)')
    .click();

  // The widget writes the chosen date back into the input as text, in
  // MM/DD/YYYY format.
  await expect(dateInput).toHaveValue(/\d{2}\/15\/\d{4}/);
});

test('navigate to a different month before picking a date', async ({ page }) => {
  await page.goto('https://demoqa.com/date-picker');

  await page.locator('#datePickerMonthYearInput').click();

  const calendar = page.locator('.react-datepicker');
  const monthHeading = calendar.locator('.react-datepicker__current-month');
  const currentMonthText = await monthHeading.textContent();

  // The "Next Month" arrow button advances the calendar by one month
  // without closing the popup.
  await calendar.getByLabel('Next Month').click();

  await expect(monthHeading).not.toHaveText(currentMonthText ?? '');
});
