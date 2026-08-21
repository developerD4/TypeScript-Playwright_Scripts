import { test, expect } from '@playwright/test';

/**
 * 5. Auto-waiting mechanism — how it eliminates explicit/implicit wait code
 *
 * Older tools (e.g. plain Selenium) often need explicit waits:
 *   driver.wait(until.elementIsVisible(element), 5000)
 *
 * Playwright locators auto-wait instead: before performing an action like
 * click() or fill(), Playwright automatically waits for the element to be
 * attached, visible, stable (not animating), and receiving events — up to
 * the test timeout. You almost never need manual sleeps or wait calls.
 */

test.describe('05 - Auto-waiting mechanism', () => {
  test('click() waits for the element to exist and become actionable', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    // No explicit "wait for input to appear" call here. The locator itself
    // waits until the element is ready before typing into it.
    const newTodoInput = page.getByPlaceholder('What needs to be done?');
    await newTodoInput.fill('Learn Playwright auto-waiting');
    await newTodoInput.press('Enter');

    // toBeVisible() also auto-retries: it keeps checking until the todo
    // appears in the DOM, instead of failing instantly if it's not there yet.
    await expect(page.getByText('Learn Playwright auto-waiting')).toBeVisible();
  });

  test('expect() assertions auto-retry until the condition is true', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');

    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy milk');
    await input.press('Enter');
    await input.fill('Walk the dog');
    await input.press('Enter');

    // Even though the count changes asynchronously as items render,
    // toHaveCount() polls automatically — no manual delay needed.
    await expect(page.locator('.todo-list li')).toHaveCount(2);
  });
});

// Mini-exercise: try page.locator('.todo-list li').first().click({ timeout: 1000 })
// on an element that never appears, and observe the auto-wait timeout error message.
