import { test, expect } from '@playwright/test';


// ==================== SELECT DATE ====================

test('Select a date from calendar', async ({ page }) => {

  await page.goto('https://demoqa.com/date-picker');

  const dateInput = page.locator('#datePickerMonthYearInput');

  // Open calendar
  await dateInput.click();

  // Verify calendar is visible
  await expect(page.locator('.react-datepicker')).toBeVisible();

  // Select 15th
  await page
    .locator('.react-datepicker__day--015')
    .filter({ visible: true })
    .click();

  // Verify date is entered
  await expect(dateInput).toHaveValue(/15/);
});


// ==================== CHANGE MONTH ====================

test('Change month in calendar', async ({ page }) => {

  await page.goto('https://demoqa.com/date-picker');

  const dateInput = page.locator('#datePickerMonthYearInput');

  // Open calendar
  await dateInput.click();

  const calendar = page.locator('.react-datepicker');

  // Get current month
  const currentMonth = calendar.locator('.react-datepicker__current-month');

  // Move to next month
  await calendar.getByLabel('Next Month').click();

  // Verify calendar is still visible
  await expect(calendar).toBeVisible();
});