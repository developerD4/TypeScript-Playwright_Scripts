// 03-custom-steps-attachments-and-labels.spec.ts
//
// TOPIC: adding custom steps, attachments, and labels to enrich Allure reports
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// Everything here comes from `allure-js-commons`'s runtime API, imported
// as `allure` — the SAME package Playwright's own reporter (topic 02) and
// the categorization helpers (topic 04) both build on. Compare
// `allure.step()` to Playwright's own `test.step()`
// (see tests/10-Reporting, Debugging & Failure Analysis/01-...): they look
// similar and both show up as a timeline in their respective reports, but
// `test.step()` only enriches Playwright's OWN html/list reporters —
// `allure.step()` is what actually gets written into allure-results/ and
// shown in the Allure report specifically.

import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

test('allure.step() builds a readable, nested action timeline', async ({ page }) => {
  await allure.step('Open SauceDemo', async () => {
    await page.goto('https://www.saucedemo.com');
  });

  await allure.step('Log in', async () => {
    // A step's callback receives a stepContext, which can itself record
    // parameters scoped to just that step — useful for showing exactly
    // what input a specific step used, without cluttering the whole
    // test's parameter list (see the label section below for
    // test-wide parameters).
    await allure.step('Fill the login form', async (stepContext) => {
      await stepContext.parameter('username', 'standard_user');
      await stepContext.parameter('password', 'secret_sauce', 'masked');

      await page.locator('#user-name').fill('standard_user');
      await page.locator('#password').fill('secret_sauce');
    });

    await allure.step('Submit', async () => {
      await page.locator('#login-button').click();
    });
  });

  await expect(page).toHaveURL(/inventory\.html/);
});

test('allure.attachment() attaches arbitrary data to the report', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  const productNames = await page.locator('.inventory_item_name').allTextContents();

  // Content type can be passed as a plain MIME string...
  await allure.attachment('product-names.json', JSON.stringify(productNames, null, 2), {
    contentType: 'application/json',
  });

  // ...or via allure-js-commons's own ContentType enum, which also covers
  // binary types like images and video (see file 05 in this folder for
  // screenshots/video specifically).
  await allure.attachment('page-title.txt', await page.title(), 'text/plain');

  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('allure.label()/allure.parameter() attach test-wide metadata', async ({ page }) => {
  // A generic escape hatch for any label Allure supports beyond the
  // dedicated helpers in file 04 (severity/epic/feature/story) — useful
  // for custom, project-specific labels your Allure setup recognizes.
  await allure.label('module', 'inventory');
  await allure.label('testType', 'e2e');

  // Test-wide parameters (as opposed to the step-scoped ones in the first
  // test above) show up in the report's parameter table for the whole
  // test, useful for recording which INPUT this particular run used —
  // e.g. which browser, which data set, which environment.
  await allure.parameter('environment', 'dev');

  await page.goto('https://www.saucedemo.com');
  await expect(page.locator('.login_logo')).toBeVisible();
});

test('allure.description() and allure.displayName() improve report readability', async ({
  page,
}) => {
  // Markdown-formatted description shown at the top of this test's page
  // in the report — good for explaining WHY a test exists, not just what
  // it does (the test name already says what).
  await allure.description(
    '**Why this test exists:** confirms the login form is reachable and ' +
      'renders correctly — a smoke check other, deeper tests assume already passed.'
  );

  // Overrides how the test's name is DISPLAYED in the report, independent
  // of its actual `test(...)` title string in the source code — handy
  // when the source-code name needs to stay stable (e.g. other tooling
  // references it) but you want a friendlier label in the report itself.
  await allure.displayName('Login page smoke check');

  await page.goto('https://www.saucedemo.com');
  await expect(page.locator('.login_logo')).toBeVisible();
});
