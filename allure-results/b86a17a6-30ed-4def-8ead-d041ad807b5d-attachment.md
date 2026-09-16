# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Allure-reporting\01-basic-allure.spec.ts >> OrangeHRM user can log in
- Location: tests\Allure-reporting\01-basic-allure.spec.ts:9:5

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
  4  |  * Basic Allure integration:
  5  |  * No Allure code is required inside this test.
  6  |  * The allure-playwright reporter records the test automatically.
  7  |  */
  8  | 
  9  | test('OrangeHRM user can log in', async ({ page }) => {
> 10 |   await page.goto('/web/index.php/auth/login');
     |              ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  11 | 
  12 |   await page.locator('input[name="username"]').fill('Admin');
  13 |   await page.locator('input[name="password"]').fill('admin123');
  14 |   await page.locator('button[type="submit"]').click();
  15 | 
  16 |   await expect(page).toHaveURL(/dashboard/);
  17 |   await expect(page.locator('h6')).toHaveText('Dashboard');
  18 | });
  19 | 
```