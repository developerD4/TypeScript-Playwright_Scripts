// 07-hybrid-api-and-ui-testing.spec.ts
//
// TOPIC: combining API and UI testing in hybrid end-to-end test scenarios
//
// Site used: https://automationexercise.com (see sites.txt #4)
// Helper code reused here: ./helpers/accountApi.ts
//
// The pattern: use the API for everything that's PRECONDITION (account
// creation, data setup), and the UI for the part the test is actually
// verifying (does the logged-in experience look/behave right for a real
// user). This is file 05's chaining idea, extended one step further —
// the chain's LAST link hands off into the browser instead of staying in
// pure API calls.

import { test, expect } from '@playwright/test';
import { createAccount, deleteAccount } from './helpers/accountApi';

test('create an account via API, then log in and verify via the UI', async ({ page, request }) => {
  const email = `qa.hybrid.${Date.now()}@example.com`;
  const password = 'Passw0rd!123';

  // API setup — no browser involved yet, fast and reliable.
  const created = await createAccount(request, { name: 'Hybrid User', email, password });
  expect(created.responseCode).toBe(201);

  // UI verification — THIS is what the test is actually about: does the
  // login FORM correctly authenticate an account, and does the logged-in
  // header correctly reflect it. Skipping the API step above and instead
  // filling out the full ~15-field signup form through the UI would add
  // several more seconds and several more possible flake points, for
  // setup that isn't what this test is checking.
  await page.goto('https://automationexercise.com/login');
  await page.locator('[data-qa="login-email"]').fill(email);
  await page.locator('[data-qa="login-password"]').fill(password);
  await page.locator('[data-qa="login-button"]').click();

  await expect(page.locator('a:has-text("Logged in as")')).toHaveText('Logged in as Hybrid User');

  await deleteAccount(request, email, password);
});

test('page.request shares the browser session — cross-check UI state via a live API call', async ({
  page,
  request,
}) => {
  const email = `qa.hybrid2.${Date.now()}@example.com`;
  const password = 'Passw0rd!123';

  await createAccount(request, { name: 'Cross Check User', email, password });

  await page.goto('https://automationexercise.com/login');
  await page.locator('[data-qa="login-email"]').fill(email);
  await page.locator('[data-qa="login-password"]').fill(password);
  await page.locator('[data-qa="login-button"]').click();
  await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();

  // page.request (not the standalone `request` fixture) shares cookies
  // with `page`'s own browser context — so an API call made through it
  // reflects the SAME session the browser just authenticated. Here we use
  // it to independently confirm, via the API, the exact data the UI is
  // now displaying — two different code paths agreeing on the same fact.
  const detailsResponse = await page.request.get(
    'https://automationexercise.com/api/getUserDetailByEmail',
    { params: { email } }
  );
  const details = await detailsResponse.json();

  const uiText = await page.locator('a:has-text("Logged in as")').innerText();
  expect(uiText).toContain(details.user.name);

  await deleteAccount(request, email, password);
});

test('API cleanup after a UI-driven action, without re-entering the UI to do it', async ({
  page,
  request,
}) => {
  const email = `qa.hybrid3.${Date.now()}@example.com`;
  const password = 'Passw0rd!123';

  await createAccount(request, { name: 'Cleanup Demo User', email, password });

  await page.goto('https://automationexercise.com/login');
  await page.locator('[data-qa="login-email"]').fill(email);
  await page.locator('[data-qa="login-password"]').fill(password);
  await page.locator('[data-qa="login-button"]').click();
  await expect(page.locator('a:has-text("Logged in as")')).toBeVisible();

  // Cleanup doesn't have to mirror however the test itself worked — even
  // though this test drove the UI, tearing the account down through the
  // API (fast, no navigation needed) is still the right choice, exactly
  // like every other cleanup call in this repo (e.g.
  // tests/09-Test Data & Environment Management/04-database-seeding-and-cleanup.spec.ts).
  await deleteAccount(request, email, password);

  const verifyGone = await request.post('https://automationexercise.com/api/verifyLogin', {
    form: { email, password },
  });
  const verifyBody = await verifyGone.json();
  expect(verifyBody.responseCode).toBe(404);
});
