// 06-validating-api-responses.spec.ts
//
// TOPIC: validating API responses — status codes, headers, and JSON
// "schema" (shape/type) checks
//
// Site used: https://automationexercise.com/api (see sites.txt #4)
//   A small public REST API with no auth required, good for practicing
//   pure API assertions. We use `request`, Playwright's built-in HTTP
//   client fixture — no browser/page needed at all for these tests.

import { test, expect } from '@playwright/test';

test('status code and content-type header', async ({ request }) => {
  const response = await request.get('https://automationexercise.com/api/productsList');

  expect(response.status()).toBe(200);
  expect(response.ok()).toBe(true);

  // Real-world gotcha worth asserting on deliberately: this API returns
  // JSON in the body but its Content-Type header still says "text/html".
  // Playwright's response.json() parses the body regardless of the header,
  // but a strict header check like this is exactly how you'd catch an API
  // that claims one content type while serving another.
  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('text/html');
});

test('JSON body shape: top-level keys and array structure', async ({ request }) => {
  const response = await request.get('https://automationexercise.com/api/productsList');
  const body = await response.json();

  // "Schema" checks, without pulling in a separate JSON-schema library:
  // assert the shape you expect — which keys exist and what type each is.
  expect(body).toHaveProperty('responseCode');
  expect(body).toHaveProperty('products');
  expect(Array.isArray(body.products)).toBe(true);
  expect(body.products.length).toBeGreaterThan(0);
});

test('JSON body shape: fields and types on an individual item', async ({ request }) => {
  const response = await request.get('https://automationexercise.com/api/productsList');
  const body = await response.json();

  const firstProduct = body.products[0];

  // Check each field's presence AND type — a schema check is really just
  // a checklist like this, written out explicitly.
  expect(typeof firstProduct.id).toBe('number');
  expect(typeof firstProduct.name).toBe('string');
  expect(typeof firstProduct.price).toBe('string'); // e.g. "Rs. 500" — not a number in this API
  expect(typeof firstProduct.brand).toBe('string');
  expect(firstProduct.category).toHaveProperty('category');
  expect(firstProduct.price).toMatch(/^Rs\. \d+$/);
});

test('this API always answers HTTP 200, so check its own responseCode field for errors', async ({
  request,
}) => {
  // Calling this endpoint with the wrong HTTP method (POST instead of GET)
  // doesn't produce a 4xx/5xx status here — the API instead returns 200
  // with an error described INSIDE the JSON body. This is a real quirk of
  // this particular API and a good reminder: always check what a given API
  // actually does on error, rather than assuming HTTP status alone tells
  // the whole story.
  const response = await request.post('https://automationexercise.com/api/productsList');
  const body = await response.json();

  expect(response.status()).toBe(200); // transport-level: request succeeded
  expect(body.responseCode).toBe(405); // application-level: request was rejected
  expect(body.message).toContain('not supported');
});

test('cross-checking two related endpoints for consistent data', async ({ request }) => {
  const [productsResponse, brandsResponse] = await Promise.all([
    request.get('https://automationexercise.com/api/productsList'),
    request.get('https://automationexercise.com/api/brandsList'),
  ]);

  const { products } = await productsResponse.json();
  const { brands } = await brandsResponse.json();

  const knownBrandNames = new Set(brands.map((b: { brand: string }) => b.brand));

  // Every brand referenced by a product should also exist in the
  // dedicated brands list — a simple but genuinely useful consistency
  // check between two endpoints of the same API.
  const productBrands: string[] = products.map((p: { brand: string }) => p.brand);
  for (const brand of productBrands) {
    expect(knownBrandNames.has(brand)).toBe(true);
  }
});
