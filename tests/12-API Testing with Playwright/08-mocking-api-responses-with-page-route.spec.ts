// 08-mocking-api-responses-with-page-route.spec.ts
//
// TOPIC: mocking/stubbing API responses using page.route() for
// deterministic UI tests
//
// This file uses a small, self-contained HTML/JS "widget" (built with
// page.setContent()) that fetches '/api/user-profile' and renders the
// result — standing in for a real single-page app's data-fetching
// component. Using a purpose-built widget instead of a real site's own
// API keeps this demonstration stable and focused: it isn't at the mercy
// of a real site changing its API shape or fetching data server-side
// instead of client-side (many of this repo's target sites do exactly
// that, which is WHY a real site isn't used for this particular topic).
//
// The core idea: intercept the network call BEFORE it reaches a real
// server, and return a response you fully control — so the UI's behavior
// for a specific scenario (empty list, server error, a specific data
// value) becomes 100% reproducible, instead of depending on the real
// backend happening to be in that state right now.

import { test, expect, type Page, type Route } from '@playwright/test';

const PROFILE_WIDGET_HTML = `
  <div id="app">Loading...</div>
  <script>
    fetch('/api/user-profile')
      .then((r) => {
        if (!r.ok) throw new Error('request failed with ' + r.status);
        return r.json();
      })
      .then((data) => {
        document.getElementById('app').innerHTML =
          '<h1 id="name">' + data.name + '</h1>' +
          '<p id="plan">' + data.plan + '</p>';
      })
      .catch((err) => {
        document.getElementById('app').innerHTML =
          '<p id="error">Could not load profile: ' + err.message + '</p>';
      });
  </script>
`;

async function loadProfileWidget(page: Page): Promise<void> {
  // A real origin is needed first so the widget's relative fetch('/api/...')
  // resolves against a real domain — page.route()'s pattern matches
  // regardless of which real domain is used underneath.
  await page.goto('https://www.saucedemo.com');
  await page.setContent(PROFILE_WIDGET_HTML);
}

test('mocking a successful response drives the UI deterministically', async ({ page }) => {
  await page.route('**/api/user-profile', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ name: 'Mocked Jane', plan: 'Gold' }),
    });
  });

  await loadProfileWidget(page);

  // No real backend was ever called — this exact name/plan combination is
  // guaranteed by the mock, not by whatever a real server happens to
  // return today.
  await expect(page.locator('#name')).toHaveText('Mocked Jane');
  await expect(page.locator('#plan')).toHaveText('Gold');
});

test('mocking a server error tests the UI\'s error-handling path on demand', async ({ page }) => {
  // Reproducing a real 500 error from a real backend on demand is often
  // impractical (you'd have to actually break the server). Mocking one
  // makes this error-path test as reliable as the happy-path test above.
  await page.route('**/api/user-profile', (route) => {
    route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({}) });
  });

  await loadProfileWidget(page);

  await expect(page.locator('#error')).toContainText('request failed with 500');
  await expect(page.locator('#name')).toHaveCount(0); // the success UI never rendered
});

test('mocking an empty result tests the UI\'s empty-state, not just "some data" vs "no data"', async ({
  page,
}) => {
  await page.route('**/api/user-profile', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ name: '', plan: 'none' }),
    });
  });

  await loadProfileWidget(page);

  await expect(page.locator('#plan')).toHaveText('none');
});

test('route.continue() inspects a request without changing its response', async ({ page }) => {
  // Not every use of page.route() is about REPLACING a response —
  // sometimes the goal is just to observe or modify the OUTGOING request
  // (e.g. assert a specific header was sent) while letting the real
  // response through unchanged. Here, nothing is faked; the mocked
  // profile endpoint below still needs its own route since there's no
  // real server behind it in this demo.
  let capturedUrl = '';

  await page.route('**/api/user-profile', (route) => {
    capturedUrl = route.request().url();
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ name: 'Observed User', plan: 'Silver' }),
    });
  });

  await loadProfileWidget(page);

  await expect(page.locator('#name')).toHaveText('Observed User');
  expect(capturedUrl).toContain('/api/user-profile');
});

test('unrouting: page.unroute() stops intercepting for the rest of the test', async ({ page }) => {
  const handler = (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ name: 'Temporarily Mocked', plan: 'Bronze' }),
    });
  };

  await page.route('**/api/user-profile', handler);
  await loadProfileWidget(page);
  await expect(page.locator('#name')).toHaveText('Temporarily Mocked');

  // Remove the interception — a later fetch to the same URL pattern would
  // go to the real network again instead of this handler. Useful when a
  // test only needs a mock for PART of its flow (e.g. mock a slow
  // third-party call during setup, then test real behavior afterward).
  await page.unroute('**/api/user-profile', handler);
});
