// 04-categorizing-tests-severity-epic-feature-story.spec.ts
//
// TOPIC: categorizing tests using severity, epic, feature, and story tags
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// These labels don't change how a test RUNS — they change how the Allure
// report organizes and filters hundreds/thousands of tests afterward. On
// a small suite this feels unnecessary; on a large one, "show me only
// blocker-severity tests in the Checkout epic" (a few clicks in Allure's
// filters) is the difference between a useful report and an
// unnavigable wall of test names.

import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

test('a blocker-severity test in the "Authentication" epic', async ({ page }) => {
  // Severity communicates IMPACT if this test's scenario breaks in
  // production — not how important the test itself is to maintain.
  // allure-js-commons's Severity values: blocker, critical, normal, minor, trivial.
  await allure.severity('blocker');
  await allure.epic('Authentication'); // the largest grouping — a whole business area
  await allure.feature('Login'); // a specific capability within that epic
  await allure.story('A registered user can log in with valid credentials'); // one user-facing scenario within that feature

  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);
});

test('a minor-severity test, same epic/feature, different story', async ({ page }) => {
  // If SauceDemo's login placeholder text changed, almost nothing breaks
  // for a real user — hence 'minor', not 'blocker', even though it's
  // still worth having a test for it.
  await allure.severity('minor');
  await allure.epic('Authentication');
  await allure.feature('Login');
  await allure.story('The login form shows helpful placeholder text');

  await page.goto('https://www.saucedemo.com');
  await expect(page.locator('#user-name')).toHaveAttribute('placeholder', 'Username');
});

test('a critical-severity test in a DIFFERENT epic — "Checkout"', async ({ page }) => {
  // Same four labels, different values — this is what lets Allure's
  // report group this test under "Checkout" instead of "Authentication",
  // alongside every other checkout-related test, regardless of which
  // SPEC FILE they happen to live in.
  await allure.severity('critical');
  await allure.epic('Checkout');
  await allure.feature('Cart');
  await allure.story('A logged-in user can add a product to the cart');

  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});

test('tags add free-form, many-to-many categorization on top of the structured labels', async ({
  page,
}) => {
  // Unlike epic/feature/story (roughly one value each, forming a
  // hierarchy), tags are unlimited and don't imply any hierarchy — good
  // for cross-cutting concerns that don't fit neatly into "which epic
  // does this belong to," like which test SUITE or CI job should pick
  // this test up.
  await allure.tags('smoke', 'regression', 'fast');
  await allure.severity('normal');

  await page.goto('https://www.saucedemo.com');
  await expect(page.locator('.login_logo')).toBeVisible();
});

// A rule of thumb for the hierarchy: epic > feature > story roughly maps
// to "business area" > "capability" > "specific scenario" — the same
// granularity you'd use writing a user story ticket, which is often
// exactly where these three values should come from in a real project.
