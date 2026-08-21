// 03-auto-retrying-assertions.spec.ts
//
// TOPIC: auto-retrying assertions and their role in reducing test flakiness
//
// Site used: https://the-internet.herokuapp.com/dynamic_loading/1 (see sites.txt #2)
//   Clicking "Start" hides the button and reveals a hidden element 5
//   seconds later — a real (not simulated) source of timing flakiness,
//   which is exactly the situation auto-retrying assertions solve.
//
// A web-first assertion like expect(locator).toBeVisible() doesn't check
// once and give up — it polls the condition repeatedly until it's true or
// the timeout (default 5s, configurable) elapses. That's what lets you
// write `await expect(...).toBeVisible()` right after triggering an async
// UI change, with no manual delay in between.

import { test, expect } from '@playwright/test';

test('an auto-retrying assertion waits out a real UI delay by itself', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');

  await page.locator('#start button').click();

  // #finish is hidden (display:none) for 5 seconds after the click. No
  // manual wait/sleep is needed — toBeVisible() keeps re-checking until it
  // becomes true, well within its default 5s timeout... except this page
  // needs closer to 5s, so we widen the timeout for just this assertion.
  await expect(page.locator('#finish')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('#finish')).toHaveText('Hello World!');
});

test('the same assertion FAILS FAST when checked without retrying', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');

  await page.locator('#start button').click();

  // isVisible() (no "expect", no "await" needed on the check itself) reads
  // the CURRENT state once, synchronously — it does NOT wait. Right after
  // the click, the element is still hidden, so this is reliably false, in
  // contrast to expect(...).toBeVisible() above which would wait for it.
  const visibleRightAway = await page.locator('#finish').isVisible();
  expect(visibleRightAway).toBe(false);
});

test('expect.poll() retries an arbitrary function, not just a locator', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');

  await page.locator('#start button').click();

  // expect.poll() is for asserting on values that don't come from a
  // locator directly — here, the element's own visibility as computed by
  // page.evaluate(). It re-runs the callback until the assertion passes or
  // the timeout elapses, the same retrying behavior as toBeVisible().
  await expect
    .poll(
      async () => {
        return page.locator('#finish').evaluate((el) => getComputedStyle(el).display);
      },
      { timeout: 10000 }
    )
    .toBe('block');
});

test('custom timeout: override the default 5s retry window per assertion', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');

  await page.locator('#start button').click();

  // This page's #finish element doesn't even exist in the DOM until the
  // delay finishes, and the delay here is close to the default 5s
  // timeout — passing an explicit timeout avoids a flaky race against it.
  await expect(page.locator('#finish')).toBeVisible({ timeout: 10000 });
});
