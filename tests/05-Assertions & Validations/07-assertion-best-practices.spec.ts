import { test, expect } from '@playwright/test';

// =====================================================
// GUIDELINE 1: Assert the USER-VISIBLE RESULT
// =====================================================

test('Check the result of an action', async ({ page }) => {

  await page.goto('https://playwrightlab.github.io/');

  // Perform an action
  await page.getByRole('button', { name: /submit/i }).click();

  // Check what the user can see
  await expect(page.getByText(/success|submitted/i)).toBeVisible();
});


// =====================================================
// GUIDELINE 2: ONE TEST = ONE BEHAVIOR
// =====================================================

test('Check login button is visible', async ({ page }) => {

  await page.goto('https://playwrightlab.github.io/');

  // This test focuses only on the login button
  await expect(
    page.getByRole('button', { name: /login/i })
  ).toBeVisible();
});


// =====================================================
// GUIDELINE 3: DO NOT OVER-ASSERT
// =====================================================

test('Check important details of a form', async ({ page }) => {

  await page.goto('https://playwrightlab.github.io/');

  // Check only important things
  await expect(page.getByRole('textbox').first()).toBeVisible();

  await expect(
    page.getByRole('button', { name: /submit/i })
  ).toBeEnabled();

  // Don't check unnecessary things such as:
  // CSS class
  // font size
  // exact position
  // color
  // HTML structure
});


// =====================================================
// GUIDELINE 4: USE STABLE LOCATORS AND VALUES
// =====================================================

test('Use a stable locator for assertion', async ({ page }) => {

  await page.goto('https://playwrightlab.github.io/');

  // Prefer meaningful locators
  const button = page.getByRole('button', { name: /submit/i });

  await expect(button).toBeVisible();
  await expect(button).toBeEnabled();
});


// =====================================================
// GUIDELINE 5: USE THE RIGHT ASSERTION
// =====================================================

test('Use specific assertions', async ({ page }) => {

  await page.goto('https://playwrightlab.github.io/');

  // Instead of:
  // expect(await button.isVisible()).toBe(true);

  // Prefer:
  const button = page.getByRole('button', { name: /submit/i });

  await expect(button).toBeVisible();
});
