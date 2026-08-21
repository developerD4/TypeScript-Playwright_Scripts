// 01-apirequestcontext-overview-and-setup.spec.ts
//
// TOPIC: overview and setup of Playwright's APIRequestContext
//
// Site used: https://automationexercise.com/api (see sites.txt #4)
//
// APIRequestContext is Playwright's own HTTP client — it makes real
// network requests (GET/POST/PUT/DELETE, with headers, form data, JSON
// bodies) WITHOUT launching a browser at all. It's the same underlying
// type whether you get it from the `request` fixture, from `page.request`,
// or by creating one yourself with `request.newContext()` — three
// different ways to REACH one, covered below.

import { test, expect, request } from '@playwright/test';

test('the `request` fixture: one APIRequestContext, auto-created and disposed per test', async ({
  request,
}) => {
  // Playwright creates this fixture fresh for the test and closes it
  // afterward automatically — no setup/teardown code needed, the same way
  // `page` already works for browser tests.
  const response = await request.get('https://automationexercise.com/api/productsList');

  expect(response.ok()).toBe(true);
  expect(response.status()).toBe(200);
});

test('`page.request`: the SAME kind of client, but sharing the page\'s cookies', async ({
  page,
}) => {
  // page.request is a DIFFERENT APIRequestContext instance than the
  // `request` fixture above — this one shares cookies/auth state with
  // whatever browser context `page` belongs to. That's exactly what makes
  // it the right choice for hybrid API+UI tests (see file 07) — an API
  // call made through page.request after a UI login carries that login's
  // session cookie automatically, with no manual copying needed.
  await page.goto('https://automationexercise.com');

  const response = await page.request.get('https://automationexercise.com/api/productsList');
  expect(response.ok()).toBe(true);
});

test('creating a standalone context manually with request.newContext()', async () => {
  // Useful OUTSIDE of a running test entirely — e.g.
  // framework/global-setup.ts (topic 06) uses exactly this to do an
  // environment reachability check before any test/browser exists yet.
  // Also useful for a pure-API test suite that never needs a browser at
  // all, avoiding the (small) overhead of Playwright's page/context
  // fixtures for tests that don't touch the UI.
  const apiContext = await request.newContext({
    baseURL: 'https://automationexercise.com',
    // With baseURL set, every call below can use a path instead of
    // repeating the full domain — see file 02 for that in regular use.
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  });

  const response = await apiContext.get('/api/productsList');
  expect(response.ok()).toBe(true);

  // Contexts created manually must be disposed manually too — the
  // `request` fixture does this for you automatically, but a hand-created
  // one won't clean up its connections on its own.
  await apiContext.dispose();
});

test('setup options: baseURL + extraHTTPHeaders reduce repetition across calls', async () => {
  const apiContext = await request.newContext({
    baseURL: 'https://automationexercise.com',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'X-Test-Suite': 'training-testautomation', // sent with EVERY request from this context
    },
  });

  // Every call below is relative to baseURL and automatically carries the
  // custom header — this is what setup-once, reuse-everywhere looks like
  // for a context that will make many calls.
  const products = await apiContext.get('/api/productsList');
  const brands = await apiContext.get('/api/brandsList');

  expect(products.ok()).toBe(true);
  expect(brands.ok()).toBe(true);

  await apiContext.dispose();
});
