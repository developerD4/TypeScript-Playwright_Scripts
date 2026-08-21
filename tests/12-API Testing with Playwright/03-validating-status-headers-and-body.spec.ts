// 03-validating-status-headers-and-body.spec.ts
//
// TOPIC: validating response status codes, headers, and response body content
//
// Sites used:
//   - https://httpbin.org (a public HTTP-testing service — good for
//     exercising status codes/headers directly and predictably)
//   - https://automationexercise.com/api (see sites.txt #4)

import { test, expect } from '@playwright/test';

test.describe('status codes', () => {
  test('2xx — success', async ({ request }) => {
    const response = await request.get('https://httpbin.org/status/200');
    expect(response.status()).toBe(200);
    expect(response.ok()).toBe(true); // .ok() is shorthand for "status is 200-299"
  });

  test('4xx — client error (e.g. a bad request from OUR side)', async ({ request }) => {
    const response = await request.get('https://httpbin.org/status/404');
    expect(response.status()).toBe(404);
    expect(response.ok()).toBe(false);
  });

  test('5xx — server error (the API itself failed, not our request)', async ({ request }) => {
    const response = await request.get('https://httpbin.org/status/500');
    expect(response.status()).toBe(500);
    expect(response.ok()).toBe(false);
  });

  test('status TEXT is available too, not just the numeric code', async ({ request }) => {
    const response = await request.get('https://httpbin.org/status/404');
    expect(response.statusText()).toBe('NOT FOUND');
  });
});

test.describe('headers', () => {
  test('reading and asserting on individual response headers', async ({ request }) => {
    const response = await request.get(
      'https://httpbin.org/response-headers?Content-Type=application/json&X-Custom-Header=hello'
    );

    const headers = response.headers(); // a plain object, header names lower-cased
    expect(headers['content-type']).toContain('application/json');
    expect(headers['x-custom-header']).toBe('hello');
  });

  test('a real-world gotcha: an API can claim one content-type but serve another', async ({
    request,
  }) => {
    const response = await request.get('https://automationexercise.com/api/productsList');

    // This API's body IS valid JSON (response.json() below parses fine),
    // but its Content-Type header still says "text/html" — a header
    // assertion catches exactly this kind of mismatch, which a body-only
    // check would miss entirely.
    expect(response.headers()['content-type']).toContain('text/html');
    const body = await response.json();
    expect(Array.isArray(body.products)).toBe(true);
  });

  test('headersArray() preserves duplicate header names, headers() does not', async ({
    request,
  }) => {
    // Some servers send the same header name more than once (e.g. multiple
    // Set-Cookie headers). headers() collapses duplicates into one string;
    // headersArray() keeps every individual header entry — reach for it
    // when you specifically need to inspect duplicates.
    const response = await request.get('https://httpbin.org/response-headers?a=1&a=2');
    const headerEntries = response.headersArray();
    expect(headerEntries.length).toBeGreaterThan(0);
    expect(headerEntries.every((h) => typeof h.name === 'string')).toBe(true);
  });
});

test.describe('response body content', () => {
  test('.json() parses the body directly into a usable object', async ({ request }) => {
    const response = await request.get('https://automationexercise.com/api/productsList');
    const body = await response.json();

    expect(body).toHaveProperty('products');
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('.text() gives the raw string body, for non-JSON or partial checks', async ({
    request,
  }) => {
    const response = await request.get('https://httpbin.org/robots.txt');
    const text = await response.text();

    expect(text).toContain('User-agent');
  });

  test('toMatchObject() checks a SUBSET of fields, ignoring the rest', async ({ request }) => {
    const response = await request.get('https://automationexercise.com/api/productsList');
    const body = await response.json();
    const firstProduct = body.products[0];

    // Asserts these specific fields/shapes are present and correct,
    // without having to list every OTHER field the object also happens to
    // have (id, price, category, ...) — useful when only a few fields are
    // actually relevant to what this test is checking.
    expect(firstProduct).toMatchObject({
      name: expect.any(String),
      brand: expect.any(String),
      category: {
        category: expect.any(String),
      },
    });
  });
});
