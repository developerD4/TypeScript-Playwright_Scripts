// 03-shadow-dom.spec.ts
//
// TOPIC: Locating and interacting with elements inside shadow DOM
//
// Site used: https://practice.expandtesting.com/shadowdom
//   A dedicated practice page with a real open shadow root — useful
//   because Playwright's normal locators PIERCE open shadow DOM
//   automatically, and this page is a good place to see that in action.

import { test, expect } from '@playwright/test';

test('locators pierce shadow DOM automatically', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/shadowdom');

  // No special syntax is needed — a normal CSS/role locator reaches
  // inside the shadow root as if it were regular page content.
  const shadowButton = page.locator('#shadow-host').locator('#my-btn');

  await expect(shadowButton).toHaveText('This button is inside a Shadow DOM.');
  await shadowButton.click();
});

test('why scoping to the shadow host matters', async ({ page }) => {
  await page.goto('https://practice.expandtesting.com/shadowdom');

  // This page happens to have TWO different buttons that both use
  // id="my-btn" — one is a normal button on the page, the other lives
  // inside the shadow root. A bare page.locator('#my-btn') matches BOTH
  // and throws a strict-mode error (see file 05 for more on that).
  await expect(page.locator('#my-btn')).toHaveCount(2);

  // Scoping the search to the shadow host element first — the same
  // "chaining" idea from file 01 — narrows it back down to one match.
  const shadowButton = page.locator('#shadow-host').locator('#my-btn');
  await expect(shadowButton).toHaveCount(1);
});
