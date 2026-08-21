import { test, expect } from '@playwright/test';

/**
 * 7. Handling multiple tabs/windows and switching between them
 *
 * Each browser tab/window is its own Page object. When an action opens a
 * new tab, Playwright doesn't automatically switch your `page` variable to
 * it — you listen for the context's 'page' event to get a handle on the
 * new one.
 */

test.describe('07 - Multiple tabs/windows', () => {
  test('capture a new tab opened by a link', async ({ page, context }) => {
    await page.goto('https://the-internet.herokuapp.com/windows');

    // Start waiting for the new tab BEFORE clicking, so we don't miss the
    // event — this returns a Promise that resolves once the new Page exists.
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: 'Click Here' }).click(),
    ]);

    await newPage.waitForLoadState();
    await expect(newPage.locator('h3')).toHaveText('New Window');

    // The original `page` is untouched and still on the first tab.
    await expect(page.locator('h3')).toHaveText('Opening a new window');
  });

  test('context.pages() lists every open tab in the context', async ({ page, context }) => {
    await page.goto('https://the-internet.herokuapp.com/windows');
    await page.getByRole('link', { name: 'Click Here' }).click();

    // Wait for the second tab to actually appear in the list.
    await expect.poll(() => context.pages().length).toBe(2);

    const allTabs = context.pages();
    expect(allTabs).toHaveLength(2);
  });
});

// Mini-exercise: close the newly opened tab with newPage.close(), then
// confirm context.pages() drops back down to a length of 1.
