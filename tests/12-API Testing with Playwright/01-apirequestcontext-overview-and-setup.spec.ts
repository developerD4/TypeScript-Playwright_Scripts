import { test, expect, request } from '@playwright/test';

/*
 * API testing is testing the backend APIs directly without using the UI.
 * APIRequestContext: 
 * Playwright's HTTP client for sending API requests without opening a browser.
 *
 * request fixture:
 * Playwright creates an APIRequestContext automatically for each test
 * and closes it after the test.
 */

test('use the request fixture', async ({ request }) => { //In Playwright, request is an API client that can send HTTP requests.
  // GET sends an HTTP GET request and returns an APIResponse.
  const response = await request.get(
    'https://automationexercise.com/api/productsList'
  );
  console.log(response)
  expect(response.status()).toBe(200);
  expect(response.ok()).toBe(true);
});

test('use page.request', async ({ page }) => {
  // page.request is an APIRequestContext connected to the browser context.
  await page.goto('https://automationexercise.com');
  const response = await page.request.get('https://automationexercise.com/api/productsList');
  console.log(response)
  expect(response.status()).toBe(200);
});

test('create APIRequestContext manually', async () => {
  // request.newContext() creates a new API client with its own settings.
  const apiContext = await request.newContext({
    baseURL: 'https://automationexercise.com',
    extraHTTPHeaders: {
      Accept: 'application/json',
    }, //adds headers to API requests made by this context. It is not mandatory for every API. If the API works without the Accept header, you don't need to add it.
  });

  const response = await apiContext.get('/api/productsList');
  console.log(response)
  expect(response.status()).toBe(200);

  // A manually created context must be closed manually.
  await apiContext.dispose();
});
// | Header                     | Meaning                 |
// | -------------------------- | ----------------------- |
// | `Accept: application/json` | I want JSON             |
// | `Accept: application/xml`  | I want XML              |
// | `Accept: text/html`        | I want HTML             |
// | `Accept: text/plain`       | I want plain text       |
// | `Accept: */*`              | I can accept any format |

