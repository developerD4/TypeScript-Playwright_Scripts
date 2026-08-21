// 02-integrating-allure-playwright-adapter.spec.ts
//
// TOPIC: integrating Allure with Playwright using the allure-playwright adapter
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// Installed packages (devDependencies in package.json):
//   allure-playwright    — the Playwright REPORTER that writes allure-results/
//   allure-commandline   — the Java-based `allure` CLI that turns those
//                          results into an HTML report (see file 01 for
//                          why these are two separate tools)
//
// Wired up in playwright.config.ts:
//   reporter: [
//     ['list'],
//     ['html', { outputFolder: 'playwright-report', open: 'never' }],
//     ['allure-playwright', { resultsDir: 'allure-results', detail: true, suiteTitle: false }],
//   ],
//
// Running ANY test in this repo now also writes Allure result files —
// there's nothing test-file-specific required for basic integration; the
// tests below just happen to be simple ones to try it with first.

import { test, expect } from '@playwright/test';

test('a plain test — no Allure-specific code needed for basic reporting', async ({ page }) => {
  // This test uses nothing from `allure-js-commons` at all, and still
  // shows up fully in the Allure report: its name, status, duration,
  // screenshots/video/trace (already configured in topic 10), and
  // console output are all captured automatically by the reporter.
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);
});

// `resultsDir` (in the config snippet above) controls WHERE result files
// are written. If two projects in a monorepo both use allure-playwright,
// giving each a distinct resultsDir keeps their results from mixing
// together in one folder before a report is generated.
//
// The full workflow, start to finish:
//
//   1. npx playwright test                        (writes allure-results/)
//   2. npm run allure:generate                     (allure-results/ -> allure-report/, a static site)
//   3. npm run allure:open                         (serves allure-report/ locally and opens it)
//
// Or, for local iteration without a separate generate step:
//   npm run allure:serve                           (generates a TEMPORARY report from
//                                                    allure-results/ and opens it directly —
//                                                    convenient locally; use generate+open
//                                                    for a report you want to keep or publish)
