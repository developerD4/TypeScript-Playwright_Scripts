import { test, expect, chromium } from '@playwright/test';

/**
 * 2. Browser, BrowserContext, and Page — isolated session architecture
 *
 * - Browser: one running browser process (e.g. one Chromium instance).
 * - BrowserContext: an isolated "incognito-like" session inside that browser —
 *   its own cookies, storage, and cache. Cheap to create, so Playwright Test
 *   gives every test a fresh context automatically.
 * - Page: a single tab/window living inside a context.
 *
 * This is WHY tests don't leak state into each other: each test gets its own
 * context, so logging in / setting a cookie in one test never affects another.
 */

test.describe('02 - Browser, BrowserContext, and Page isolation', () => {
  test('each test gets its own isolated context automatically', async ({ page, context }) => {
    // `page` and `context` are provided as fixtures by the Playwright Test
    // Runner — a brand new BrowserContext + Page, created just for this test.
    await page.goto('https://demo.playwright.dev/todomvc');

    // Prove the context starts with no stored state: no cookies yet.
    const cookiesBefore = await context.cookies();
    expect(cookiesBefore.length).toBe(0);

    // localStorage lives on the page's origin, scoped to this context only.
    await page.evaluate(() => localStorage.setItem('trainee', 'hello'));
    const value = await page.evaluate(() => localStorage.getItem('trainee'));
    expect(value).toBe('hello');
  });

  test('two contexts in the same browser do not share storage', async () => {
    // Here we manage the Browser/Context/Page layers manually to make the
    // isolation visible, instead of relying on the test/page fixtures.
    const browser = await chromium.launch();

    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    await pageA.goto('https://demo.playwright.dev/todomvc');
    await pageA.evaluate(() => localStorage.setItem('user', 'alice'));

    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    await pageB.goto('https://demo.playwright.dev/todomvc');
    const userInB = await pageB.evaluate(() => localStorage.getItem('user'));

    // contextB never saw contextA's localStorage — separate sessions,
    // same underlying Browser process.
    expect(userInB).toBeNull();

    await browser.close();
  });
});

// Mini-exercise: open two pages inside the SAME context (context.newPage()
// twice) and confirm they DO share localStorage, unlike two separate contexts.
