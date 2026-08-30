import { test, expect } from '@playwright/test';

// Built-in fixtures: page, context, browser, browserName, request

test.describe('02 - Built-in fixtures', () => {
  test('page and context fixtures are ready to use immediately', async ({ page, context }) => {
    // `page` is already a live tab, `context` is the isolated session it lives in.
    expect(context).toBeTruthy();
    await page.goto('https://demo.playwright.dev/todomvc');
    const a = expect(page).toHaveURL(/todomvc/)
    console.log(a)
    await expect(page).toHaveURL(/todomvc/);
  });

  // test('browser fixture gives access to the underlying Browser object', async ({ browser }) => {
  //   // Useful when you need to create an EXTRA context beyond the default one,
  //   // e.g. to simulate two different users at once.
  //   const secondContext = await browser.newContext();
  //   const secondPage = await secondContext.newPage();
  //   await secondPage.goto('https://demo.playwright.dev/todomvc');
  //   await expect(secondPage.getByPlaceholder('What needs to be done?')).toBeVisible();
  //   await secondContext.close();
  // });

  // test('browserName fixture tells you which engine is running', async ({ browserName }) => {
  //   // A plain string: 'chromium' | 'firefox' | 'webkit'. Handy for skipping
  //   // or branching a test that only makes sense on one engine.
  //   expect(['chromium', 'firefox', 'webkit']).toContain(browserName);
  // });

  // test('request fixture makes API calls without opening a browser page', async ({ request }) => {
  //   // `request` is an APIRequestContext — great for quick API checks or for
  //   // seeding data before a UI test, without the overhead of a page.
  //   const response = await request.get('https://demo.playwright.dev/todomvc');
  //   expect(response.ok()).toBeTruthy();
  // });
});
