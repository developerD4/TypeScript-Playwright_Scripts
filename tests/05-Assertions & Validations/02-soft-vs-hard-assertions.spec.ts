import { test, expect } from '@playwright/test';


// ==================== HARD ASSERTION ====================

test('Hard assertion', async ({ page }) => {

  await page.goto('https://playwrightlab.github.io/');

  // Hard assertion
  await expect(page).toHaveTitle(/Playwright/);

  // This runs only if the above assertion passes
  await expect(page).toHaveURL('https://playwrightlab.github.io/');
});


// ==================== SOFT ASSERTION ====================

test('Soft assertion', async ({ page }) => {

  await page.goto('https://playwrightlab.github.io/');

  // Soft assertion - test continues even if it fails
  await expect.soft(page).toHaveTitle(/Playwright/);

  // This will still execute
  await expect.soft(page).toHaveURL('https://playwrightlab.github.io/');

  // Another independent check
  await expect.soft(page.getByRole('heading').first()).toBeVisible();
});


// ==================== HARD + SOFT ====================

test('Hard and soft assertions together', async ({ page }) => {

  await page.goto('https://playwrightlab.github.io/');

  // Hard assertion - important condition
  await expect(page).toHaveURL('https://playwrightlab.github.io/');

  // Soft assertions - independent checks
  await expect.soft(page).toHaveTitle(/Playwright/);

  await expect.soft(
    page.getByRole('heading').first()
  ).toBeVisible();

  await expect.soft(
    page.getByRole('button').first()
  ).toBeVisible();
});