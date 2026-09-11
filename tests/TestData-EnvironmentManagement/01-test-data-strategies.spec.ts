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
//import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

test.describe('Test Data Strategies', () => {

  // -------------------------------------------------
  // 1. STATIC DATA
  // -------------------------------------------------

  test('Static test data', async ({ page }) => {

    const username = 'standard_user';
    const password = 'secret_sauce';

    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill(username);
    await page.locator('#password').fill(password);
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory/);
  });


  // -------------------------------------------------
  // 2. DYNAMIC DATA
  // -------------------------------------------------

  test('Dynamic test data from JSON', async ({ page }) => {

    const filePath = path.join(
      __dirname,
      '../test-data/users.json'
    );

    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const users = JSON.parse(fileContent);

    const user = users[0];

    await page.goto('https://www.saucedemo.com');

    await page.locator('#user-name').fill(user.username);
    await page.locator('#password').fill(user.password);
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory/);
  });


  // -------------------------------------------------
  // 3. ON-THE-FLY DATA
  // -------------------------------------------------

  test('On-the-fly generated data', async () => {

    const email = faker.internet.email();

    console.log('Generated Email:', email);

    expect(email).toContain('@');
  });

});