# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Allure-reporting\06-trace-attachment.spec.ts >> attach an OrangeHRM trace for one test
- Location: tests\Allure-reporting\06-trace-attachment.spec.ts:10:5

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/web/index.php/auth/login", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import * as allure from 'allure-js-commons';
  3  | 
  4  | /*
  5  |  * Trace:
  6  |  * A trace records browser actions, screenshots, and page snapshots.
  7  |  * It is very useful when debugging a failed test.
  8  |  */
  9  | 
  10 | test('attach an OrangeHRM trace for one test', async ({ context, page }, testInfo) => {
  11 |   await context.tracing.start({
  12 |     screenshots: true,
  13 |     snapshots: true,
  14 |   });
  15 | 
> 16 |   await page.goto('/web/index.php/auth/login');
     |              ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  17 | 
  18 |   await page.locator('input[name="username"]').fill('Admin');
  19 |   await page.locator('input[name="password"]').fill('admin123');
  20 |   await page.locator('button[type="submit"]').click();
  21 | 
  22 |   const tracePath = testInfo.outputPath('orangehrm-login-trace.zip');
  23 | 
  24 |   await context.tracing.stop({
  25 |     path: tracePath,
  26 |   });
  27 | 
  28 |   await allure.attachTrace('orangehrm-login-trace', tracePath);
  29 | 
  30 |   await expect(page).toHaveURL(/dashboard/);
  31 | });
  32 | 
```