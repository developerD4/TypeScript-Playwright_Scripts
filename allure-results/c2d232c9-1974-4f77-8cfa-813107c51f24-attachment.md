# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Allure-reporting\05-video-attachment.spec.ts >> OrangeHRM login flow with video recording
- Location: tests\Allure-reporting\05-video-attachment.spec.ts:11:5

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
  4  |  * Video recording:
  5  |  * Playwright records the browser session when video is enabled.
  6  |  * The allure-playwright reporter can include the recorded artifact in Allure.
  7  |  */
  8  | 
  9  | test.use({ video: 'on' });
  10 | 
  11 | test('OrangeHRM login flow with video recording', async ({ page }) => {
> 12 |   await page.goto('/web/index.php/auth/login');
     |              ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  13 | 
  14 |   await page.locator('input[name="username"]').fill('Admin');
  15 |   await page.locator('input[name="password"]').fill('admin123');
  16 |   await page.locator('button[type="submit"]').click();
  17 | 
  18 |   await expect(page).toHaveURL(/dashboard/);
  19 | });
  20 | 
```