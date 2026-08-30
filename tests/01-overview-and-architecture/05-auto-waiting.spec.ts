import { test, expect } from '@playwright/test';

test.describe('Auto-Waiting in Playwright', () => {

  test('Playwright waits before clicking or filling', async ({ page }) => {

    await page.goto('https://demo.playwright.dev/todomvc');

    // Find the input box
    const input = page.getByPlaceholder('What needs to be done?');

    // Playwright automatically waits for the input
    // before entering the text
    await input.fill('Learn Playwright');

    // Add the todo
    await input.press('Enter');

    // Playwright automatically waits for the todo
    // before checking if it is visible
    await expect(page.getByText('Learn Playwright')).toBeVisible();
  });


  test('Playwright waits for assertions', async ({ page }) => {

    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.getByPlaceholder('What needs to be done?');

    // Add first todo
    await input.fill('Buy milk');
    await input.press('Enter');

    // Add second todo
    await input.fill('Walk the dog');
    await input.press('Enter');

    // Playwright waits until 2 todos are available
    await expect(page.locator('.todo-list li')).toHaveCount(2);
  });

});