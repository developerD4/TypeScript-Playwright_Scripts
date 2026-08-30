import { test, expect } from '@playwright/test';

test.describe('Playwright Fixtures', () => {

  test('Using page fixture', async ({ page }) => {

    // page represents one browser tab

    await page.goto('https://demo.playwright.dev/todomvc');

    await expect(page).toHaveTitle(/TodoMVC/);
  });

  test('Using context fixture', async ({ page, context }) => {

    // page = browser tab
    // context = browser session

    await page.goto('https://demo.playwright.dev/todomvc');

    // Check that the page belongs to this context
    expect(page.context()).toBe(context);
  });

  test('Using browser fixture', async ({ page, browser }) => {

    // browser = browser instance
    // page = browser tab

    await page.goto('https://demo.playwright.dev/todomvc');

    await expect(page).toHaveTitle(/TodoMVCc/);
  });

  test('Using page and context together', async ({ page, context }) => {

    await page.goto('https://demo.playwright.dev/todomvc');

    // Create another tab in the same context
    const secondPage = await context.newPage();

    await secondPage.goto('https://demo.playwright.dev/todomvc');

    // There are now 2 pages/tabs in this context
    expect(context.pages().length).toBe(2);
  });

});