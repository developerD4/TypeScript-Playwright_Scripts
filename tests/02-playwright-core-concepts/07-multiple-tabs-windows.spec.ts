import { test, expect } from '@playwright/test';

test.describe('Multiple Tabs and Windows', () => {

  test('Handle a new tab', async ({ page, context }) => {

    await page.goto('https://the-internet.herokuapp.com/windows');

    // Wait for new tab and click the link
    const [newTab] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: 'Click Here' }).click()
    ]);

    // Verify the new tab
    await newTab.waitForLoadState();
    await expect(newTab.locator('h3')).toHaveText('New Window');

    // Verify the original tab
    await expect(page.locator('h3')).toHaveText('Opening a new window');
  });


  test('Get all open tabs', async ({ page, context }) => {

    await page.goto('https://the-internet.herokuapp.com/windows');

    // Open a new tab
    await page.getByRole('link', { name: 'Click Here' }).click();

    // Wait until 2 tabs are available
    await expect.poll(() => context.pages().length).toBe(2);

    // Get all open tabs
    const tabs = context.pages();

    expect(tabs).toHaveLength(2);
  });

});