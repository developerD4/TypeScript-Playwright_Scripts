import { test, expect } from '@playwright/test';

test.describe('Network Interception', () => {

  test('Observe network requests using route.continue()', async ({ page }) => {

    let requestCount = 0;

    // Intercept requests and allow them to continue
    await page.route('**/*', (route) => {
      requestCount++;
      route.continue();
    });

    await page.goto('https://demo.playwright.dev/todomvc');

    // Verify that requests were captured
    expect(requestCount).toBeGreaterThan(0);
  });


  test('Block network requests using route.abort()', async ({ page }) => {

    // Block JavaScript files
    await page.route('**/*.js', (route) => {
      route.abort();
    });

    await page.goto('https://demo.playwright.dev/todomvc');

    // Application cannot load without JavaScript
    await expect(
      page.getByPlaceholder('What needs to be done?')
    ).not.toBeVisible();
  });


  test('Mock a response using route.fulfill()', async ({ page }) => {

    // Return our own fake response
    await page.route('**/mock-data.json', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'This is fake data'
        })
      });
    });

    // Request the mocked API
    const result = await page.evaluate(async () => {
      const response = await fetch('/mock-data.json');
      return response.json();
    });

    // Verify the fake response
    expect(result.message).toBe('This is fake data');
  });

});