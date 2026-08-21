import { test, expect } from '@playwright/test';

/**
 * 8. playwright.config.ts — projects, timeouts, retries, baseURL, reporters
 *
 * This test doesn't change playwright.config.ts — it demonstrates, from
 * INSIDE a test, how the config options you set there actually show up at
 * runtime. Open playwright.config.ts alongside this file while reading it.
 */

test.describe('08 - playwright.config.ts settings in action', () => {
  test('testInfo exposes the current project (from the `projects` array)', async ({
    page,
  }, testInfo) => {
    // `projects` in the config defines chromium/firefox/webkit. Whichever
    // one is running this test, its name is available here — useful for
    // logging or branching test logic per-browser.
    console.log(`Running on project: ${testInfo.project.name}`);
    expect(['chromium', 'firefox', 'webkit']).toContain(testInfo.project.name);

    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page).toHaveTitle(/TodoMVC/);
  });

  test('retries and timeout are visible on testInfo too', async ({ }, testInfo) => {
    // `retries` (how many times a failing test re-runs) and `timeout`
    // (max ms a single test may run) are both set once in the config and
    // apply to every test automatically — no per-test boilerplate needed.
    console.log(`Configured retries: ${testInfo.project.retries}`);
    console.log(`Configured timeout (ms): ${testInfo.timeout}`);

    expect(testInfo.timeout).toBeGreaterThan(0);
  });

  test('baseURL lets you goto() with a relative path', async ({ page }) => {
    // If `use.baseURL` is set in the config (e.g. 'https://demo.playwright.dev'),
    // page.goto('/todomvc') resolves against it — you don't repeat the
    // full domain in every test. Here we goto() the full URL directly since
    // this project's baseURL isn't set by default.
    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
  });
});

// Mini-exercise: add `baseURL: 'https://demo.playwright.dev'` under `use` in
// playwright.config.ts, then rewrite the last test's goto() to use
// page.goto('/todomvc') and confirm it still passes.
