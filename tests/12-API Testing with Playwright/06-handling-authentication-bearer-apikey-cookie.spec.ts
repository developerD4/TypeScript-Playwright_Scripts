// 06-handling-authentication-bearer-apikey-cookie.spec.ts
//
// TOPIC: handling authentication — bearer tokens, API keys, and
// cookie-based auth
//
// Site used: https://httpbin.org — a public HTTP-testing service with
// dedicated endpoints for each auth style below, which is exactly what
// makes it a clean way to verify Playwright's side of the mechanism
// (attaching the right header/cookie correctly) independent of any one
// real app's specific login flow.

import { test, expect, request } from '@playwright/test';

test.describe('bearer token auth', () => {
  test('sending a Bearer token via the Authorization header', async ({ request }) => {
    const response = await request.get('https://httpbin.org/bearer', {
      headers: { Authorization: 'Bearer test-token-123' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.authenticated).toBe(true);
    expect(body.token).toBe('test-token-123');
  });

  test('a missing/invalid token is rejected with 401', async ({ request }) => {
    const response = await request.get('https://httpbin.org/bearer');
    expect(response.status()).toBe(401);
  });

  test('setting the token ONCE for every request from a context, via extraHTTPHeaders', async () => {
    // The realistic pattern: obtain a token once (often from a login/auth
    // endpoint — see the chaining pattern in file 05), then configure a
    // context to attach it to every subsequent call automatically,
    // instead of repeating the header on every single request.
    const authedContext = await request.newContext({
      baseURL: 'https://httpbin.org',
      extraHTTPHeaders: {
        Authorization: 'Bearer test-token-123',
      },
    });

    const response = await authedContext.get('/bearer');
    const body = await response.json();
    expect(body.authenticated).toBe(true);

    await authedContext.dispose();
  });
});

test.describe('API key auth', () => {
  test('sending an API key via a custom header', async ({ request }) => {
    // Unlike Bearer tokens, there's no single standard header name for API
    // keys — X-Api-Key is common, but always check the specific API's own
    // docs (other real examples: X-API-Token, Api-Key, or a query
    // parameter instead of a header entirely).
    const response = await request.get('https://httpbin.org/headers', {
      headers: { 'X-Api-Key': 'demo-api-key-123' },
    });

    const body = await response.json();
    expect(body.headers['X-Api-Key']).toBe('demo-api-key-123');
  });

  test('an API key sent as a query parameter instead of a header', async ({ request }) => {
    // Some APIs expect the key IN the URL instead — Playwright's `params`
    // option handles this the same way as any other query parameter.
    const response = await request.get('https://httpbin.org/get', {
      params: { api_key: 'demo-api-key-123' },
    });

    const body = await response.json();
    expect(body.args.api_key).toBe('demo-api-key-123');
  });
});

test.describe('cookie-based auth', () => {
  test('a context automatically stores and resends cookies, like a browser would', async () => {
    const cookieContext = await request.newContext({ baseURL: 'https://httpbin.org' });

    // httpbin's /cookies/set/<name>/<value> sets a cookie and redirects to
    // /cookies, which echoes back whatever cookies it received — a stand-in
    // for a real login endpoint that sets a session cookie on success.
    await cookieContext.get('/cookies/set/session_id/abc123session');

    // A SEPARATE, later request on the SAME context — no manual cookie
    // copying needed. This is the exact mechanism that makes chaining
    // "log in via API, then act as that logged-in user" work (see file 07
    // for page.request specifically sharing cookies with the browser).
    const response = await cookieContext.get('/cookies');
    const body = await response.json();
    expect(body.cookies.session_id).toBe('abc123session');

    await cookieContext.dispose();
  });

  test('context.storageState() exposes the cookies a context is currently holding', async () => {
    const cookieContext = await request.newContext({ baseURL: 'https://httpbin.org' });
    await cookieContext.get('/cookies/set/auth_token/xyz789');

    const state = await cookieContext.storageState();
    const authCookie = state.cookies.find((c) => c.name === 'auth_token');

    expect(authCookie?.value).toBe('xyz789');
    // This is also how you'd SAVE a logged-in session to reuse across
    // multiple test files without logging in again each time — write
    // storageState() to a JSON file, then pass it as the `storageState`
    // option to a later request.newContext() or browser context.

    await cookieContext.dispose();
  });
});
