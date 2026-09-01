import { test, expect } from '@playwright/test';

test.describe('Test Hooks', () => {

  // Runs once before all tests
  test.beforeAll(() => {
    console.log('Before all tests');
  });

  // Runs before every test
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc');
  });

  // Runs after every test
  test.afterEach(() => {
    console.log('Test completed');
  });

  // Runs once after all tests
  test.afterAll(() => {
    console.log('After all tests');
  });


  test('Check Todo page', async ({ page }) => {

    await expect(
      page.getByPlaceholder('What needs to be done?')
    ).toBeVisible();

  });


  test('Add a Todo', async ({ page }) => {

    const todoInput = page.getByPlaceholder('What needs to be done?');

    await todoInput.fill('Learn Playwright');
    await todoInput.press('Enter');

    await expect(
      page.locator('.todo-list li')
    ).toHaveCount(1);

  });

});