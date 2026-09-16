# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Allure-reporting\02-allure-steps-attachments-labels.spec.ts >> add custom Allure metadata
- Location: tests\Allure-reporting\02-allure-steps-attachments-labels.spec.ts:63:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button[type="submit"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('button[type="submit"]') with timeout 5000ms
  - waiting for locator('button[type="submit"]')

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import * as allure from 'allure-js-commons';
  3  | 
  4  | /*
  5  |  * Allure step:
  6  |  * A step is a named action shown in the Allure test timeline.
  7  |  * allure.step() makes the report easier to understand.
  8  |  */
  9  | 
  10 | test('OrangeHRM login with readable Allure steps', async ({ page }) => {
  11 |   await allure.step('Open OrangeHRM login page', async () => {
  12 |     await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  13 |   });
  14 | 
  15 |   await allure.step('Enter login details', async (step) => {
  16 |     await step.parameter('username', 'Admin');
  17 |     await step.parameter('password', 'admin123', 'masked');
  18 | 
  19 |     await page.locator('input[name="username"]').fill('Admin');
  20 |     await page.locator('input[name="password"]').fill('admin123');
  21 |   });
  22 | 
  23 |   await allure.step('Click Login', async () => {
  24 |     await page.locator('button[type="submit"]').click();
  25 |   });
  26 | 
  27 |   await expect(page).toHaveURL(/dashboard/);
  28 | });
  29 | 
  30 | /*
  31 |  * Attachment:
  32 |  * An attachment is extra evidence stored with a test result.
  33 |  * It can contain text, JSON, screenshots, traces, or other files.
  34 |  */
  35 | 
  36 | test('attach useful OrangeHRM test data', async ({ page }) => {
  37 |   await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  38 | 
  39 |   const title = await page.title();
  40 |   await allure.attachment('page-title.txt', title, 'text/plain');
  41 | 
  42 |   const testData = JSON.stringify(
  43 |     {
  44 |       application: 'OrangeHRM',
  45 |       username: 'Admin',
  46 |       pageTitle: title,
  47 |     },
  48 |     null,
  49 |     2
  50 |   );
  51 | 
  52 |   await allure.attachment('test-data.json', testData, 'application/json');
  53 | 
  54 |   await expect(page.locator('input[name="username"]')).toBeVisible();
  55 | });
  56 | 
  57 | /*
  58 |  * Labels and parameters:
  59 |  * Labels help organize and filter tests in Allure.
  60 |  * Parameters show the input or environment used by a test.
  61 |  */
  62 | 
  63 | test('add custom Allure metadata', async ({ page }) => {
  64 |   await allure.label('module', 'authentication');
  65 |   await allure.label('testType', 'smoke');
  66 |   await allure.parameter('environment', 'demo');
  67 | 
  68 |   await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  69 | 
> 70 |   await expect(page.locator('button[type="submit"]')).toBeVisible();
     |                                                       ^ Error: expect(locator).toBeVisible() failed
  71 | });
  72 | 
```