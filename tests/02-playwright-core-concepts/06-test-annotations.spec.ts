import { test, expect } from '@playwright/test';

/**
 * 6. Test annotations: test.skip, test.fixme, test.only, test.slow
 *
 * Annotations change how a specific test is treated by the runner, without
 * deleting or commenting out the test itself.
 */

test.describe('06 - Test annotations', () => {
  test('test.skip(condition, reason) skips conditionally', async ({ page, browserName }) => {
    // Skips ONLY on webkit, with a reason shown in the report — the test
    // still "exists" and shows up as skipped, not silently deleted.
    test.skip(browserName === 'webkit', 'Example: pretend this feature is Chromium/Firefox-only');

    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
  });

  test('test.fixme(condition, reason) marks a known-broken test', async ({ page }) => {
    // Like test.skip, but semantically means "this is broken, needs fixing" —
    // a signal to future readers rather than "not applicable here."
    test.fixme(false, 'Example only — flip to true to mark this test as a known failure to revisit');

    await page.goto('https://demo.playwright.dev/todomvc');
    await expect(page).toHaveURL(/todomvc/);
  });

  test('test.slow() gives a test 3x the normal timeout', async ({ page }) => {
    // Use for a test that's legitimately slower than most (e.g. more steps),
    // instead of inflating the timeout for the whole suite.
    test.slow();

    await page.goto('https://demo.playwright.dev/todomvc');
    for (const item of ['Buy milk', 'Walk dog', 'Read book']) {
      await page.getByPlaceholder('What needs to be done?').fill(item);
      await page.getByPlaceholder('What needs to be done?').press('Enter');
    }
    await expect(page.locator('.todo-list li')).toHaveCount(3);
  });

  // test.only(...) restricts a WHOLE run to just the marked test(s) — every
  // other test in the run (even other files) gets skipped. That makes it
  // unsafe to leave active in shared training material, so it's shown here
  // only as a comment. Try uncommenting it locally to see the effect:
  //
  // test.only('temporarily run just this test while debugging', async ({ page }) => {
  //   await page.goto('https://demo.playwright.dev/todomvc');
  // });
});

// Mini-exercise: temporarily add test.only to one test above, run the whole
// 02-playwright-core-concepts folder, and observe how many tests actually run.
