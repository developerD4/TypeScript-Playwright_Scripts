// 06-waiting-strategies.spec.ts
//
// TOPIC: waitForSelector, waitForLoadState, waitForResponse, waitForURL
//
// Sites used:
//   - https://the-internet.herokuapp.com/dynamic_loading/1 (see sites.txt #2)
//     Element exists but is hidden, then revealed 5s after clicking Start.
//   - https://the-internet.herokuapp.com/dynamic_loading/2 (see sites.txt #2)
//     Element doesn't exist at all until 5s after clicking Start.
//   - https://www.saucedemo.com (see sites.txt #3) — waitForURL after login
//
// IMPORTANT: expect(locator).toBeVisible() (and friends) already auto-wait
// and auto-retry, so in most Playwright tests you don't need any of the
// explicit waits below. Reach for them only when you need to wait for
// something that isn't a locator assertion — e.g. a specific network
// response, a URL change, or a custom load state.

import { test, expect } from '@playwright/test';

test('waitForSelector: wait for a HIDDEN element to become visible', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');

  await page.locator('#start button').click();

  // #finish exists in the DOM immediately but has style="display:none"
  // until the 5s timer fires. waitForSelector({ state: 'visible' }) waits
  // for exactly that transition.
  await page.waitForSelector('#finish', { state: 'visible', timeout: 10000 });

  await expect(page.locator('#finish')).toHaveText('Hello World!');
});

test('waitForSelector: wait for an element to be ATTACHED to the DOM', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');

  await page.locator('#start button').click();

  // On this page #finish doesn't exist in the HTML at all until the JS
  // creates it after the delay, so we wait for it to be attached.
  await page.waitForSelector('#finish', { state: 'attached', timeout: 10000 });

  await expect(page.locator('#finish')).toBeVisible();
});

test('waitForResponse: wait for a specific network response before asserting', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');

  // Clicking Start triggers a request for the loading spinner image.
  // Wrapping the click and the wait in Promise.all avoids a race condition:
  // if we clicked first and then called waitForResponse, the response
  // could already have arrived before we started listening for it.
  const [response] = await Promise.all([
    page.waitForResponse((res) => res.url().includes('ajax-loader.gif')),
    page.locator('#start button').click(),
  ]);

  expect(response.status()).toBe(200);
});

test('waitForURL: wait for navigation to a specific URL after an action', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  // Waits until the page's URL matches the given pattern, useful right
  // after an action that triggers client-side navigation.
  await page.waitForURL(/inventory\.html/);

  await expect(page.locator('.title')).toHaveText('Products');
});

test('waitForLoadState: wait for the network to go quiet after navigating', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc', { waitUntil: 'commit' });

  // 'networkidle' waits until there have been no network connections for
  // 500ms. It's rarely needed (Playwright's auto-waiting handles most
  // cases) but is useful for pages that keep loading background resources
  // you want to ignore before interacting.
  await page.waitForLoadState('networkidle');

  await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
});
