import { test, expect } from '@playwright/test';

/**
 * 9. Network interception basics using page.route()
 *
 * page.route(urlPattern, handler) lets you intercept requests matching a
 * glob pattern BEFORE they reach the network. From the handler you can:
 * - route.continue()  — let it through unchanged (but you got to observe it)
 * - route.abort()     — block it entirely
 * - route.fulfill()   — respond yourself, without ever hitting the real server
 */

test.describe('09 - Network interception basics', () => {
  test('route.continue() lets you observe every request without changing it', async ({ page }) => {
    let requestCount = 0;

    await page.route('**/*', (route) => {
      requestCount++;
      route.continue(); // don't change anything, just count it
    });

    await page.goto('https://demo.playwright.dev/todomvc');

    // The page made at least one request (the document itself) — proves the
    // handler actually ran.
    expect(requestCount).toBeGreaterThan(0);
  });

  test('route.abort() blocks matching requests entirely', async ({ page }) => {
    // Block every JavaScript file. The React app that renders the todo
    // input depends on its JS bundle, so blocking it should prevent the
    // interactive UI from ever appearing.
    await page.route('**/*.js', (route) => route.abort());

    await page.goto('https://demo.playwright.dev/todomvc');

    await expect(page.getByPlaceholder('What needs to be done?')).not.toBeVisible({
      timeout: 3000,
    });
  });

  test('route.fulfill() returns a fake response without hitting the network', async ({ page }) => {
    // Mock out a request entirely — useful for testing how the UI reacts to
    // specific API responses (success, error, empty state) without needing
    // a real backend to produce them.
    await page.route('**/mock-data.json', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'this came from Playwright, not a real server' }),
      })
    );

    const response = await page.request.get('https://demo.playwright.dev/mock-data.json').catch(() => null);
    // page.route also applies to page.evaluate(fetch(...)) calls; here we
    // instead trigger it via the page itself to keep the mock in scope.
    const result = await page.evaluate(async () => {
      const res = await fetch('/mock-data.json');
      return res.json();
    });
    expect(result.message).toBe('this came from Playwright, not a real server');
  });
});

// Mini-exercise: change the abort pattern from '**/*.js' to '**/*.css' and
// observe that the app still WORKS but looks unstyled.
