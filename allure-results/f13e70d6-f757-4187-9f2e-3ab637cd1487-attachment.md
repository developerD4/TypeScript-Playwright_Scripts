# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Allure-reporting\03-allure-categories.spec.ts >> OrangeHRM login page shows username field
- Location: tests\Allure-reporting\03-allure-categories.spec.ts:31:5

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
  5  |  * Severity:
  6  |  * Severity describes the impact of a test failure.
  7  |  * Common values are blocker, critical, normal, minor, and trivial.
  8  |  *
  9  |  * Epic > Feature > Story:
  10 |  * Epic = large business area.
  11 |  * Feature = capability inside that business area.
  12 |  * Story = one specific user scenario.
  13 |  */
  14 | 
  15 | test('Admin can log in to OrangeHRM', async ({ page }) => {
  16 |   await allure.severity('blocker');
  17 |   await allure.epic('Authentication');
  18 |   await allure.feature('Login');
  19 |   await allure.story('Admin logs in with valid credentials');
  20 |   await allure.tags('smoke', 'regression');
  21 | 
  22 |   await page.goto('/web/index.php/auth/login');
  23 |   await page.locator('input[name="username"]').fill('Admin');
  24 |   await page.locator('input[name="password"]').fill('admin123');
  25 |   await page.locator('button[type="submit"]').click();
  26 | 
  27 |   await expect(page).toHaveURL(/dashboard/);
  28 |   await expect(page.locator('h6')).toHaveText('Dashboard');
  29 | });
  30 | 
  31 | test('OrangeHRM login page shows username field', async ({ page }) => {
  32 |   await allure.severity('minor');
  33 |   await allure.epic('Authentication');
  34 |   await allure.feature('Login');
  35 |   await allure.story('Login page displays username field');
  36 | 
> 37 |   await page.goto('/web/index.php/auth/login');
     |              ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  38 | 
  39 |   await expect(page.locator('input[name="username"]')).toBeVisible();
  40 | });
  41 | 
```