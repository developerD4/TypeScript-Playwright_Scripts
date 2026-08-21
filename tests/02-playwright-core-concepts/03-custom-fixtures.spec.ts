import { test as base, expect } from '@playwright/test';

/**
 * 3. Writing custom fixtures for test setup/teardown (e.g., logged-in state)
 *
 * Built-in fixtures like `page` cover generic needs. When MANY of your tests
 * repeat the same setup (e.g. "log in first"), you extend `test` with your
 * own fixture instead of copy-pasting the login steps into every test.
 */

// Extend the base `test` with a new fixture called `loggedInPage`.
const test = base.extend<{ loggedInPage: import('@playwright/test').Page }>({
  loggedInPage: async ({ page }, use) => {
    // --- setup: runs before the test body ---
    await page.goto('https://the-internet.herokuapp.com/login');
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('.flash.success')).toBeVisible();

    // Hand the ready-to-use, already-logged-in page to the test.
    await use(page);

    // --- teardown: runs after the test body finishes ---
    await page.getByRole('link', { name: 'Logout' }).click();
  },
});

test.describe('03 - Custom fixtures for setup/teardown', () => {
  test('test body starts already logged in', async ({ loggedInPage }) => {
    // No login code here at all — the fixture already did it, so the test
    // can focus purely on what it's actually verifying.
    await expect(loggedInPage.locator('h2')).toHaveText('Secure Area');
  });

  test('a second test also gets a fresh logged-in session', async ({ loggedInPage }) => {
    // Fixtures run again per test, so this is a brand new login — not the
    // same session reused from the test above.
    await expect(loggedInPage).toHaveURL(/secure/);
  });
});

// Mini-exercise: add a `username` parameter to the fixture (via fixture
// options) so different tests can log in as different users.
