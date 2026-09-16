# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Allure-reporting\04-allure-artifacts.spec.ts >> attach a simple OrangeHRM test log
- Location: tests\Allure-reporting\04-allure-artifacts.spec.ts:46:5

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/web/index.php/auth/login", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /*
  4  |  * Playwright artifacts:
  5  |  * Playwright can capture screenshots, videos, and traces automatically.
  6  |  * The allure-playwright reporter can include these artifacts in Allure.
  7  |  *
  8  |  * The main configuration is in playwright.config.ts.
  9  |  */
  10 | 
  11 | test('OrangeHRM login flow with automatic artifacts', async ({ page }) => {
  12 |   await page.goto('/web/index.php/auth/login');
  13 | 
  14 |   await page.locator('input[name="username"]').fill('Admin');
  15 |   await page.locator('input[name="password"]').fill('admin123');
  16 |   await page.locator('button[type="submit"]').click();
  17 | 
  18 |   await expect(page).toHaveURL(/dashboard/);
  19 | });
  20 | 
  21 | /*
  22 |  * Manual screenshot:
  23 |  * A manual screenshot captures a specific moment chosen by the test.
  24 |  * It is useful when you want evidence at a particular point.
  25 |  */
  26 | 
  27 | test('manual screenshot of OrangeHRM login page', async ({ page }, testInfo) => {
  28 |   await page.goto('/web/index.php/auth/login');
  29 | 
  30 |   const screenshot = await page.screenshot({ fullPage: true });
  31 | 
  32 |   await testInfo.attach('orangehrm-login-page.png', {
  33 |     body: screenshot,
  34 |     contentType: 'image/png',
  35 |   });
  36 | 
  37 |   await expect(page.locator('input[name="username"]')).toBeVisible();
  38 | });
  39 | 
  40 | /*
  41 |  * Custom log:
  42 |  * A custom log records useful business-level information.
  43 |  * It gives the report a simple story of what the test did.
  44 |  */
  45 | 
  46 | test('attach a simple OrangeHRM test log', async ({ page }, testInfo) => {
  47 |   const log: string[] = [];
  48 | 
  49 |   const record = (message: string) => {
  50 |     log.push(`${new Date().toISOString()} - ${message}`);
  51 |   };
  52 | 
  53 |   record('Opening OrangeHRM login page');
> 54 |   await page.goto('/web/index.php/auth/login');
     |              ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  55 | 
  56 |   record('Checking username field');
  57 |   await expect(page.locator('input[name="username"]')).toBeVisible();
  58 | 
  59 |   record('Test completed');
  60 | 
  61 |   await testInfo.attach('test-log.txt', {
  62 |     body: log.join('\n'),
  63 |     contentType: 'text/plain',
  64 |   });
  65 | });
  66 | 
```