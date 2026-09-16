import { test, expect, type Page, type Route } from '@playwright/test';

/*
 * Mocking:
 * Replaces a real network response with a response controlled by the test.
 * This makes UI behavior deterministic.
 *
 * page.route() = intercept a matching browser request.
 * route.fulfill() = return a response created by the test.
 * route.request() = inspect the intercepted request.
 * page.unroute() = remove a route handler.
 */

const PROFILE_WIDGET_HTML = `
  <div id="app">Loading...</div>
  <script>
    fetch('/api/user-profile')
      .then((response) => {
        if (!response.ok) {
          throw new Error('request failed with ' + response.status);
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById('app').innerHTML =
          '<h1 id="name">' + data.name + '</h1>' +
          '<p id="plan">' + data.plan + '</p>';
      })
      .catch((error) => {
        document.getElementById('app').innerHTML =
          '<p id="error">Could not load profile: ' + error.message + '</p>';
      });
  </script>
`;

async function loadProfileWidget(page: Page): Promise<void> {
  // The small widget represents a UI that normally calls an API.
  await page.goto('https://automationexercise.com');
  await page.setContent(PROFILE_WIDGET_HTML);
}

test('mock a successful API response', async ({ page }) => {
  await page.route('**/api/user-profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        name: 'Mocked Jane',
        plan: 'Gold',
      }),
    });
  });

  await loadProfileWidget(page);

  expect(await page.locator('#name').textContent()).toBe('Mocked Jane');
  expect(await page.locator('#plan').textContent()).toBe('Gold');
});

test('mock a 500 server error', async ({ page }) => {
  await page.route('**/api/user-profile', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({}),
    });
  });

  await loadProfileWidget(page);

  // We can test the error UI without actually breaking a server.
  await expect(page.locator('#error')).toContainText('500');
  await expect(page.locator('#name')).toHaveCount(0);
});

test('mock empty data to test the empty-state UI', async ({ page }) => {
  await page.route('**/api/user-profile', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        name: '',
        plan: 'none',
      }),
    });
  });

  await loadProfileWidget(page);

  await expect(page.locator('#plan')).toHaveText('none');
});

test('inspect an intercepted request before returning a response', async ({ page }) => {
  let capturedUrl = '';

  await page.route('**/api/user-profile', async (route) => {
    // route.request() gives information about the outgoing request.
    capturedUrl = route.request().url();

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        name: 'Observed User',
        plan: 'Silver',
      }),
    });
  });

  await loadProfileWidget(page);

  expect(capturedUrl).toContain('/api/user-profile');
  await expect(page.locator('#name')).toHaveText('Observed User');
});

test('remove a route with page.unroute()', async ({ page }) => {
  const handler = async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        name: 'Temporarily Mocked',
        plan: 'Bronze',
      }),
    });
  };

  await page.route('**/api/user-profile', handler);
  await loadProfileWidget(page);

  await expect(page.locator('#name')).toHaveText('Temporarily Mocked');

  // unroute() removes this interception.
  await page.unroute('**/api/user-profile', handler);
});
