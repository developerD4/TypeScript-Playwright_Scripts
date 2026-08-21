// 02-fill-type-press-keyboard-shortcuts.spec.ts
//
// TOPIC: fill, pressSequentially (typing key-by-key), press, and keyboard shortcuts
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// fill() vs pressSequentially():
//   - locator.fill(text)  sets the value directly (fast, no keydown/keyup
//     events per character). Use this almost always — it's what real users'
//     *end result* looks like and it's much faster in a test suite.
//   - locator.pressSequentially(text) sends a real keydown/input/keyup event
//     for EACH character. Use it only when the page has JS that reacts to
//     individual keystrokes (e.g. a live search-as-you-type box or a
//     custom-formatted input), because fill() would skip those key events.
//   Note: Locator.type() used to do this job but is now deprecated in
//   Playwright in favor of pressSequentially() — prefer the latter.

import { test, expect } from '@playwright/test';

test('fill() sets input values instantly', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');

  await expect(page.locator('#user-name')).toHaveValue('standard_user');
  await expect(page.locator('#password')).toHaveValue('secret_sauce');
});

test('pressSequentially() simulates real key-by-key typing', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  const usernameField = page.locator('#user-name');
  await usernameField.pressSequentially('standard_user', { delay: 20 });

  await expect(usernameField).toHaveValue('standard_user');
});

test('press() sends a single key, e.g. Enter to submit the login form', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');

  // Pressing Enter inside the password field submits the form, just like
  // clicking the Login button would.
  await page.locator('#password').press('Enter');

  await expect(page).toHaveURL(/inventory\.html/);
});

test('keyboard shortcuts: Ctrl+A / Cmd+A selects all text in a field', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  const usernameField = page.locator('#user-name');
  await usernameField.fill('standard_user');

  // "Control+A" works cross-platform in Playwright — on macOS it is
  // automatically translated to "Meta+A" for you.
  await usernameField.press('Control+A');
  await usernameField.press('Backspace'); // deletes the selected text

  await expect(usernameField).toHaveValue('');

  // page.keyboard gives you low-level control when there's no single
  // element to target, e.g. simulating a global shortcut.
  await usernameField.fill('locked_out_user');
  await page.keyboard.press('Tab'); // move focus to the password field
  await expect(page.locator('#password')).toBeFocused();
});
