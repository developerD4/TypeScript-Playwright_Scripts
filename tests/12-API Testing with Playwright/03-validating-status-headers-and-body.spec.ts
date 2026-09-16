import { test, expect } from '@playwright/test';

/*
 * API Response Validation
 * Status  → HTTP result
 * Headers → response information
 * Body    → data returned by API
 */

// 1. Validate status code
test('Validate status code', async ({ request }) => {
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/1'
  );

  // status() returns the HTTP status code.
  expect(response.status()).toBe(200);

  // ok() returns true for 200-299 status codes.
  expect(response.ok()).toBe(true);
});

// 2. Validate response headers
test('Validate response headers', async ({ request }) => {
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/1'
  );

  // headers() returns response headers.
  const headers = response.headers();

  expect(headers['content-type']).toContain('application/json');
});

// 3. Validate response body
test('Validate response body', async ({ request }) => {
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/1'
  );

  // json() converts JSON response into a JavaScript object.
  const body = await response.json();

  expect(body.id).toBe(1);
  expect(body.userId).toBe(1);
  expect(body.title).toBeTruthy();
  expect(body.body).toBeTruthy();
});

// 4. Validate selected fields
test('Validate selected fields', async ({ request }) => {
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/1'
  );

  const body = await response.json();

  // toMatchObject() checks only the fields we specify.
  expect(body).toMatchObject({
    id: 1,
    userId: 1
  });
});

// 5. Read response as text
test('Read response as text', async ({ request }) => {
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/1'
  );

  // text() returns the response body as a string.
  const body = await response.text();

  expect(body).toContain('"id": 1');
});

// 6. Validate error response
test('Validate 404 response', async ({ request }) => {
  const response = await request.get(
    'https://jsonplaceholder.typicode.com/posts/999999'
  );

  expect(response.status()).toBe(404);

  // 404 is not a successful HTTP status.
  expect(response.ok()).toBe(false);
});
