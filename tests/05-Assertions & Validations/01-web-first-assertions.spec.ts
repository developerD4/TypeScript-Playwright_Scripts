import { test, expect } from '@playwright/test';

// ==================== OPEN WEBSITE ====================

test.beforeEach(async ({ page }) => {

  await page.goto('https://playwrightlab.github.io/');
});

// ==================== toBeVisible() ====================

test('Check element visibility', async ({ page }) => {

  const heading = page.getByRole('heading').first();

  // Verify the element is visible
  await expect(heading).toBeVisible();
});

// ==================== toHaveText() ====================

test('Check element text', async ({ page }) => {

  const heading = page.getByRole('heading').first();

  // Verify the complete text
  await expect(heading).toHaveText('Playwright Lab');
});

// ==================== toContainText() ====================

test('Check partial text', async ({ page }) => {

  const body = page.locator('body');

  // Verify that the page contains the given text
  await expect(body).toContainText('Playwright');
});

// ==================== toHaveValue() ====================

test('Check input value', async ({ page }) => {

  const input = page.locator('input').first();

  // Enter text
  await input.fill('Hello');

  // Verify entered value
  await expect(input).toHaveValue('Hello');
});

// ==================== toBeEnabled() / toBeDisabled() ====================

test('Check element state', async ({ page }) => {

  const button = page.getByRole('button').first();

  // Verify button is enabled
  await expect(button).toBeEnabled();
});

// ==================== toHaveCount() ====================

test('Check number of elements', async ({ page }) => {

  const buttons = page.getByRole('button');

  // Verify number of buttons
  await expect(buttons).toHaveCount(3);
});

// ==================== toHaveAttribute() ====================

test('Check element attribute', async ({ page }) => {

  const input = page.locator('input').first();

  // Verify an attribute
  await expect(input).toHaveAttribute('type', 'text');
});

// ==================== toHaveClass() ====================

test('Check element class', async ({ page }) => {

  const heading = page.getByRole('heading').first();

  // Verify CSS class
  await expect(heading).toHaveClass(/./);
});

// ==================== toHaveURL() / toHaveTitle() ====================

test('Check page URL and title', async ({ page }) => {

  // Verify URL
  await expect(page).toHaveURL('https://playwrightlab.github.io/');

  // Verify page title
  await expect(page).toHaveTitle(/Playwright/);
});