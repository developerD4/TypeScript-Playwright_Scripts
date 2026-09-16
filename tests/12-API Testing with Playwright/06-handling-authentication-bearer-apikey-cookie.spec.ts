import { test, expect, request } from '@playwright/test';

/*
 * Authentication:
 * Proves that the caller is allowed to use an API.
 *
 * Bearer token = sent in the Authorization header.
 * API key      = sent in a header or sometimes a query parameter.
 * Cookie auth  = session information is stored in a cookie.
 */

test('Bearer token - send token in Authorization header', async ({ request }) => {
  const response = await request.get('https://httpbin.org/bearer', {
    headers: {
      Authorization: 'Bearer test-token-123',
    },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.authenticated).toBe(true);
  expect(body.token).toBe('test-token-123');
});

test('Bearer token - missing token is rejected', async ({ request }) => {
  const response = await request.get('https://httpbin.org/bearer');

  expect(response.status()).toBe(401);
});

test('Bearer token - configure it once for the API context', async () => {
  // extraHTTPHeaders is a context option that adds the header
  // to every request from this API context.
  const apiContext = await request.newContext({
    baseURL: 'https://httpbin.org',
    extraHTTPHeaders: {
      Authorization: 'Bearer test-token-123',
    },
  });

  const response = await apiContext.get('/bearer');

  expect(response.status()).toBe(200);

  await apiContext.dispose();
});

test('API key - send key in a custom header', async ({ request }) => {
  // The exact header name depends on the API documentation.
  const response = await request.get('https://httpbin.org/headers', {
    headers: {
      'X-Api-Key': 'demo-api-key-123',
    },
  });

  const body = await response.json();

  expect(body.headers['X-Api-Key']).toBe('demo-api-key-123');
});

test('API key - send key as a query parameter', async ({ request }) => {
  // params adds query parameters to the URL.
  const response = await request.get('https://httpbin.org/get', {
    params: {
      api_key: 'demo-api-key-123',
    },
  });

  const body = await response.json();

  expect(body.args.api_key).toBe('demo-api-key-123');
});

test('Cookie authentication - context stores and sends cookies', async () => {
  const apiContext = await request.newContext({
    baseURL: 'https://httpbin.org',
  });

  // This endpoint sets a cookie.
  await apiContext.get('/cookies/set/session_id/abc123');

  // The same context automatically sends the cookie on the next request.
  const response = await apiContext.get('/cookies');

  const body = await response.json();

  expect(body.cookies.session_id).toBe('abc123');

  await apiContext.dispose();
});

test('read cookies using storageState', async () => {
  const apiContext = await request.newContext({
    baseURL: 'https://httpbin.org',
  });

  await apiContext.get('/cookies/set/auth_token/xyz789');

  // storageState() returns cookies/storage information from the context.
  const state = await apiContext.storageState();

  const authCookie = state.cookies.find(
    (cookie) => cookie.name === 'auth_token'
  );

  expect(authCookie?.value).toBe('xyz789');

  await apiContext.dispose();
});
