import { test, expect } from '@playwright/test';

// ==================== STATUS CODE ====================
test('Check API status code', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts');
  //https://jsonplaceholder.typicode.com/posts
  expect(response.status()).toBe(200);
  expect(response.ok()).toBe(true);
});
// ==================== RESPONSE HEADER ====================
test('Check response header', async ({ request }) => {
  const response = await request.get('https://automationexercise.com/api/productsList');
  const contentType = response.headers()['content-type'];
  expect(contentType).toContain('text/html');
});
// ==================== JSON RESPONSE ====================
test('Check JSON response', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts');
  const body = await response.json();
  //reads the response body and converts the JSON data into a JavaScript object.{key:value} pairs - parsing
  // Check important fields
  expect(body[0]).toHaveProperty('userId');
  expect(body[0]).toHaveProperty('id');
  expect(body[0]).toHaveProperty('title');
  expect(body[0]).toHaveProperty('body');
  console.log('Response Body:', body);
  // Check that products contains data
  expect(body.length).toBeGreaterThan(0);
});
// ==================== PRODUCT DATA ====================
test('Check product data', async ({ request }) => {
  const response = await request.get('https://jsonplaceholder.typicode.com/posts');
  const body = await response.json();
  const product = body[0];
  console.log('Product:', product);
  // Check important fields
  expect(product).toHaveProperty('userId');
  expect(product).toHaveProperty('id');
  expect(product).toHaveProperty('title');
  expect(product).toHaveProperty('body');
  // Check data types
  expect(typeof product.userId).toBe('number');
  expect(typeof product.id).toBe('number');
  expect(typeof product.title).toBe('string');
  expect(typeof product.body).toBe('string');
});

//deprecated
// import { test, expect } from '@playwright/test';

// // ==================== STATUS CODE ====================

// test('Check API status code', async ({ request }) => {

//   const response = await request.get(
//     'https://automationexercise.com/api/productsList'
//   );
//   //https://jsonplaceholder.typicode.com/posts
//   expect(response.status()).toBe(200);
//   expect(response.ok()).toBe(true);
// });

// // ==================== RESPONSE HEADER ====================

// test('Check response header', async ({ request }) => {
//   const response = await request.get(
//     'https://automationexercise.com/api/productsList'
//   );
//   const contentType = response.headers()['content-type'];
//   expect(contentType).toContain('text/html');
// });

// // ==================== JSON RESPONSE ====================

// test('Check JSON response', async ({ request }) => {
//   const response = await request.get(
//     'https://automationexercise.com/api/productsList'
//   );
//   const body = await response.json();
//   //reads the response body and converts the JSON data into a JavaScript object.{key:value} pairs - parsing

//   // Check important fields
//   expect(body).toHaveProperty('responseCode');
//   expect(body).toHaveProperty('products');

//   // Check that products contains data
//   expect(body.products.length).toBeGreaterThan(0);
// });


// // ==================== PRODUCT DATA ====================

// test('Check product data', async ({ request }) => {

//   const response = await request.get(
//     'https://jsonplaceholder.typicode.com/posts'
//   );

//   const body = await response.json();

//   const product = body[0];

//   console.log('Product:', product);
//   // Check important fields
//   expect(product).toHaveProperty('id');
//   // expect(product).toHaveProperty('name');
//   // expect(product).toHaveProperty('price');
//   // expect(product).toHaveProperty('brand');

//   // // Check data types
//   // expect(typeof product.id).toBe('number');
//   // expect(typeof product.name).toBe('string');
//   // expect(typeof product.price).toBe('string');
//   // expect(typeof product.brand).toBe('string');
// });