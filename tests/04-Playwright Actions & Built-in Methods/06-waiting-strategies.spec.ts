import { test, expect } from '@playwright/test';

// ==================== waitForSelector() ====================

test('Wait for an element', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');

  await page.locator('#start button').click();

  // Wait until the element becomes visible
  await page.waitForSelector('#finish', {
    state: 'visible'
  });

  // Verify the text
  await expect(page.locator('#finish')).toHaveText('Hello World!');
});

// ==================== waitForURL() ====================

test('Wait for URL change', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/login');

  await page.locator('#username').fill('tomsmith');
  await page.locator('#password').fill('SuperSecretPassword!');

  await page.getByRole('button', { name: 'Login' }).click();

  // Wait until URL changes
  await page.waitForURL(/secure/);

  // Verify page
  await expect(page.locator('h2')).toHaveText('Secure Area');
});

// ==================== waitForLoadState() ====================

test('Wait for page to load', async ({ page }) => {

  await page.goto('https://demo.playwright.dev/todomvc');

  // Wait until network activity becomes idle
  await page.waitForLoadState('networkidle');

  // Verify page is ready
  await expect(
    page.getByPlaceholder('What needs to be done?')
  ).toBeVisible();
});

// ==================== waitForResponse() ====================

test('Wait for network response', async ({ page }) => {

  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');

  // Wait for a specific response
  const responsePromise = page.waitForResponse(
    response => response.url().includes('ajax-loader.gif')
  );

  await page.locator('#start button').click();

  const response = await responsePromise;

  // Verify response status
  expect(response.status()).toBe(200);
});