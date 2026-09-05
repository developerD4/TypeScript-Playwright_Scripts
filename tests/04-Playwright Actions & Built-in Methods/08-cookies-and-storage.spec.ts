import { test, expect } from '@playwright/test';

// ==================== COOKIES ====================

test('Add and read a cookie', async ({ page, context }) => {

  await page.goto('https://demo.playwright.dev/todomvc');

  // Add a cookie
  await context.addCookies([
    {
      name: 'username',
      value: 'John',
      url: 'https://demo.playwright.dev'
    }
  ]);

  // Get cookies
  const cookies = await context.cookies();

  // Verify cookie
  expect(cookies[0].name).toBe('username');
  expect(cookies[0].value).toBe('John');
});

// ==================== LOCAL STORAGE ====================

test('Store and read localStorage', async ({ page }) => {

  await page.goto('https://demo.playwright.dev/todomvc');

  // Store data in localStorage
  await page.evaluate(() => {
    localStorage.setItem('username', 'John');
  });

  // Read data from localStorage
  const username = await page.evaluate(() => {
    return localStorage.getItem('username');
  });

  // Verify data
  expect(username).toBe('John');
});

// ==================== SESSION STORAGE ====================

test('Store and read sessionStorage', async ({ page }) => {

  await page.goto('https://demo.playwright.dev/todomvc');

  // Store data in sessionStorage
  await page.evaluate(() => {
    sessionStorage.setItem('username', 'John');
  });

  // Read data from sessionStorage
  const username = await page.evaluate(() => {
    return sessionStorage.getItem('username');
  });

  // Verify data
  expect(username).toBe('John');
});