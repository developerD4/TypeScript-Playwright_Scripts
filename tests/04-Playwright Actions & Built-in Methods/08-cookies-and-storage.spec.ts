// 08-cookies-and-storage.spec.ts
//
// TOPIC: cookies, localStorage and sessionStorage via Playwright APIs
//
// Site used: https://demo.playwright.dev/todomvc (see sites.txt #1)
//   The todo app persists its todos to localStorage under the key
//   "react-todos", which makes it a good, real example (not a contrived
//   one) for reading/writing storage.
//
// Cookies live on the BrowserContext (context.cookies() / addCookies()),
// not on the page, because a browsing context can have multiple pages/tabs
// that all share the same cookie jar. localStorage/sessionStorage, on the
// other hand, are per-origin browser APIs, so we reach them through
// page.evaluate().

import { test, expect } from '@playwright/test';

test('read and write cookies with the browser context', async ({ page, context }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  // Add a cookie directly, without needing the UI to set it (e.g. useful
  // for pre-seeding an auth/session cookie before a test starts).
  await context.addCookies([
    {
      name: 'example_cookie',
      value: 'hello_from_playwright',
      url: 'https://demo.playwright.dev',
    },
  ]);

  const cookies = await context.cookies('https://demo.playwright.dev');
  const ourCookie = cookies.find((c) => c.name === 'example_cookie');

  expect(ourCookie?.value).toBe('hello_from_playwright');

  // Clearing removes it from the whole context (all pages/tabs).
  await context.clearCookies();
  const cookiesAfterClear = await context.cookies('https://demo.playwright.dev');
  expect(cookiesAfterClear.find((c) => c.name === 'example_cookie')).toBeUndefined();
});

test('read the app\'s own localStorage data after an action', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  const newTodoInput = page.getByPlaceholder('What needs to be done?');
  await newTodoInput.fill('Buy milk');
  await newTodoInput.press('Enter');

  // The app saves todos to localStorage under "react-todos" as a JSON
  // string. page.evaluate() runs this code IN the browser page, so it can
  // reach browser-only APIs like localStorage directly.
  const storedTodos = await page.evaluate(() => {
    const raw = localStorage.getItem('react-todos');
    return raw ? JSON.parse(raw) : [];
  });

  expect(storedTodos).toHaveLength(1);
  expect(storedTodos[0].title).toBe('Buy milk');
  expect(storedTodos[0].completed).toBe(false);
});

test('write localStorage/sessionStorage directly, before the app reads it', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  // Seed localStorage with a pre-built todo list, then reload so the app
  // picks it up on startup — a common pattern for skipping repetitive UI
  // setup steps in a test.
  await page.evaluate(() => {
    localStorage.setItem(
      'react-todos',
      JSON.stringify([{ id: 'seed-1', title: 'Seeded todo', completed: false }])
    );
    sessionStorage.setItem('example_session_key', 'only lives for this tab');
  });

  await page.reload();

  await expect(page.getByText('Seeded todo')).toBeVisible();

  // sessionStorage is scoped to the tab, not persisted to disk, and clears
  // when the tab closes — it survives a reload of the SAME page, though.
  const sessionValue = await page.evaluate(() => sessionStorage.getItem('example_session_key'));
  expect(sessionValue).toBe('only lives for this tab');
});
