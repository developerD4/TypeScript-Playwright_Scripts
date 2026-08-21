// 05-visual-regression-toHaveScreenshot.spec.ts
//
// TOPIC: visual regression testing using toHaveScreenshot()
//
// Site used: https://the-internet.herokuapp.com/login (see sites.txt #2)
//   A plain, static login form with no animations or dynamic content —
//   a good, low-flake candidate for screenshot comparison. Avoid pages
//   with ads, carousels, timestamps, or randomized content for this kind
//   of test, since those change the pixels on every run.
//
// HOW IT WORKS:
//   - The FIRST time toHaveScreenshot() runs for a given name, there is no
//     baseline yet, so Playwright saves the current screenshot as the
//     baseline and marks the test as "failed" (nothing to compare against
//     yet — you must review and accept it).
//   - Run `npx playwright test --update-snapshots` to (re-)generate and
//     accept baselines once you're happy with how the page looks.
//   - Baselines are saved per-project (e.g. per browser) next to the spec
//     file, in a folder like
//     "05-visual-regression-toHaveScreenshot.spec.ts-snapshots/".
//   - Every run AFTER that diffs the new screenshot against the saved
//     baseline, pixel by pixel, and fails if the difference exceeds the
//     configured threshold.
//
// Run this file with --update-snapshots once before relying on it, the
// same as you would for any new visual test in a real project.

import { test, expect } from '@playwright/test';

test('full page screenshot matches the saved baseline', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');

  await expect(page).toHaveScreenshot('login-page.png', {
    fullPage: true,
    // Small tolerance for anti-aliasing/font-rendering differences between
    // machines — 100% pixel-perfect matches are rarely realistic across
    // different OSes or even Playwright versions.
    maxDiffPixelRatio: 0.02,
  });
});

test('a single element can be screenshot-tested in isolation', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');

  const loginForm = page.locator('#login');

  // Scoping the screenshot to one element (instead of the whole page)
  // makes the comparison less sensitive to unrelated changes elsewhere on
  // the page, e.g. a footer or header that changes independently.
  await expect(loginForm).toHaveScreenshot('login-form-only.png');
});

test('masking a dynamic region so it does not cause false failures', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');

  // Simulate a bit of the page that changes every run, e.g. a "server
  // time" widget, so the test suite demonstrates masking without depending
  // on the real page having one.
  await page.evaluate(() => {
    const marker = document.createElement('div');
    marker.id = 'fake-dynamic-clock';
    marker.textContent = new Date().toISOString();
    document.body.prepend(marker);
  });

  // mask hides the given locator(s) behind a solid box before comparing,
  // so their ever-changing content never causes a diff.
  await expect(page).toHaveScreenshot('login-page-with-masked-clock.png', {
    mask: [page.locator('#fake-dynamic-clock')],
    fullPage: true,
  });
});
