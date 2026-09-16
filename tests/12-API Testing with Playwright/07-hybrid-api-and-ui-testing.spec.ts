import { test, expect } from '@playwright/test';
import { createAccount, deleteAccount } from './helpers/accountApi';

/*
 * Hybrid testing:
 * Use API calls for fast test-data setup/cleanup and UI actions
 * for the behavior that the user actually needs to verify.
 */

test('create account by API, then log in through UI', async ({ page, request }) => {
  const email = `qa.hybrid.${Date.now()}@example.com`;
  const password = 'Passw0rd!123';

  // API setup - no browser involved yet.
  const created = await createAccount(request, {
    name: 'Hybrid User',
    email,
    password,
  });

  expect(created.responseCode).toBe(201);

  // UI verifies the user-facing login behavior.
  await page.goto('https://automationexercise.com/login');

  await page.locator('[data-qa="login-email"]').fill(email);
  await page.locator('[data-qa="login-password"]').fill(password);
  await page.locator('[data-qa="login-button"]').click();

  await expect(
    page.locator('a:has-text("Logged in as")')
  ).toHaveText('Logged in as Hybrid User');

  // API cleanup is faster than using the UI again.
  await deleteAccount(request, email, password);
});

test('use page.request to check API data for the browser session', async ({
  page,
  request,
}) => {
  const email = `qa.hybrid2.${Date.now()}@example.com`;
  const password = 'Passw0rd!123';

  await createAccount(request, {
    name: 'Cross Check User',
    email,
    password,
  });

  await page.goto('https://automationexercise.com/login');
  await page.locator('[data-qa="login-email"]').fill(email);
  await page.locator('[data-qa="login-password"]').fill(password);
  await page.locator('[data-qa="login-button"]').click();

  await expect(
    page.locator('a:has-text("Logged in as")')
  ).toBeVisible();

  // page.request uses the browser context's cookies/session.
  const response = await page.request.get(
    'https://automationexercise.com/api/getUserDetailByEmail',
    { params: { email } }
  );

  const body = await response.json();

  const uiText = await page.locator(
    'a:has-text("Logged in as")'
  ).innerText();

  // Compare data from the API with data shown in the UI.
  expect(uiText).toContain(body.user.name);

  await deleteAccount(request, email, password);
});

test('API cleanup after a UI action', async ({ page, request }) => {
  const email = `qa.hybrid3.${Date.now()}@example.com`;
  const password = 'Passw0rd!123';

  await createAccount(request, {
    name: 'Cleanup Demo User',
    email,
    password,
  });

  await page.goto('https://automationexercise.com/login');
  await page.locator('[data-qa="login-email"]').fill(email);
  await page.locator('[data-qa="login-password"]').fill(password);
  await page.locator('[data-qa="login-button"]').click();

  await expect(
    page.locator('a:has-text("Logged in as")')
  ).toBeVisible();

  // Clean up directly through the API.
  await deleteAccount(request, email, password);

  const verifyResponse = await request.post(
    'https://automationexercise.com/api/verifyLogin',
    { form: { email, password } }
  );

  const verifyBody = await verifyResponse.json();
  expect(verifyBody.responseCode).toBe(404);
});
