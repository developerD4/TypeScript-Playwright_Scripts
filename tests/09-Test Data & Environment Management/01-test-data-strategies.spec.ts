// 01-test-data-strategies.spec.ts
//
// TOPIC: test data strategies — static, dynamic, and on-the-fly generated data
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
//
// Three different ways a test can get the data it needs, in increasing
// order of "freshness":
//
//   STATIC     — literal values written directly in the test code. Never
//                changes unless a human edits the code.
//   DYNAMIC    — loaded at runtime from an external source (a JSON/CSV
//                file, a database, an API). The VALUES are still fixed
//                ahead of time, but they live outside the test code, so
//                they can change without a code change. See file 03 in
//                this folder for a full JSON/CSV/Excel example.
//   ON-THE-FLY — generated fresh, differently, every single run (random
//                or Faker-based). See file 02 in this folder for Faker.js.
//
// None of the three is "the right one" universally — which to use depends
// on what the test actually needs, shown below.

import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';

test.describe('STATIC data — use when the exact value matters and must never drift', () => {
  // SauceDemo's demo accounts are a perfect real-world case for static
  // data: "locked_out_user" is only useful BECAUSE it's always exactly
  // that literal username — generating a random one would defeat the
  // point of the test.
  const STATIC_LOCKED_OUT_USER = 'locked_out_user';
  const STATIC_PASSWORD = 'secret_sauce';

  test('a specific, known account always produces the same locked-out error', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('#user-name').fill(STATIC_LOCKED_OUT_USER);
    await page.locator('#password').fill(STATIC_PASSWORD);
    await page.locator('#login-button').click();

    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });
});

test.describe('DYNAMIC data — use when the same values should live outside the code', () => {
  // Loaded from data/users.json at runtime, not typed inline here. A
  // non-developer (or a different team) could update this file without
  // touching test code at all — see file 03 for CSV/Excel versions of the
  // exact same idea.
  const usersFilePath = path.join(__dirname, 'data', 'users.json');
  const users: Array<{
    username: string;
    password: string;
    expectSuccess: boolean;
    expectedErrorContains: string;
  }> = JSON.parse(readFileSync(usersFilePath, 'utf-8'));

  for (const user of users) {
    test(`login with "${user.username}" / "${user.password}" (from users.json)`, async ({
      page,
    }) => {
      await page.goto('https://www.saucedemo.com');
      await page.locator('#user-name').fill(user.username);
      await page.locator('#password').fill(user.password);
      await page.locator('#login-button').click();

      if (user.expectSuccess) {
        await expect(page).toHaveURL(/inventory\.html/);
      } else {
        await expect(page.locator('[data-test="error"]')).toContainText(user.expectedErrorContains);
      }
    });
  }
});

test.describe('ON-THE-FLY data — use when the VALUE itself must be unique per run', () => {
  test('a freshly generated, never-before-used email avoids collisions', async ({ page }) => {
    // A hardcoded (static) email here would only work once against a real
    // signup form — see 02-faker-js-realistic-data.spec.ts for generating
    // this kind of data properly with Faker instead of an ad hoc string.
    const uniqueEmail = `qa.user.${Date.now()}@example.com`;

    await page.goto('https://automationexercise.com/login');
    await page.locator('[data-qa="signup-name"]').fill('Generated User');
    await page.locator('[data-qa="signup-email"]').fill(uniqueEmail);
    await page.locator('[data-qa="signup-button"]').click();

    await expect(page).toHaveURL(/signup/);
  });
});

// Quick reference for choosing between the three:
//
//   Does the test's MEANING depend on this exact value?          -> static
//   ("locked_out_user" specifically must always be locked out)
//
//   Do many similar cases share the same shape, and might change
//   independently of test code (new QA hire adds a row)?         -> dynamic
//
//   Would REUSING the same value across runs break the test
//   (uniqueness constraints, "already exists" errors)?           -> on-the-fly
