# playwright.config.ts — Projects, Timeouts, Retries, baseURL and Reporters

`playwright.config.ts` is the **central configuration file** for Playwright. It contains common settings that apply to our tests.

## 1. Projects

`projects` defines which browsers or configurations should run our tests.
```typescript
projects: [
  { name: 'chromium', use: { browserName: 'chromium' } },
  { name: 'firefox', use: { browserName: 'firefox' } },
  { name: 'webkit', use: { browserName: 'webkit' } },
],
```

**Meaning:** Projects = **Where should the test run?**

## 2. Timeout

`timeout` defines the maximum time allowed for one test. Playwright uses **milliseconds**.

```typescript
timeout: 30 * 1000,
Formula: Seconds × 1000 = Milliseconds
Examples: `30 * 1000` = 30 seconds, `60 * 1000` = 60 seconds, `2 * 60 * 1000` = 2 minutes.

**Meaning:** Timeout = **How long can one test run?**

## 3. Retries

`retries` defines how many times Playwright retries a failed test.

```typescript
retries: 1,
```

If the test fails, Playwright runs it one more time.

**Meaning:** Retries = **How many times should a failed test be retried?**

## 4. baseURL

`baseURL` stores the common URL of the application.

```typescript
use: {
  baseURL: 'https://demo.playwright.dev',
},
```

Now we can use:

```typescript
await page.goto('/todomvc');
```

instead of writing the complete URL every time.

**Meaning:** baseURL = **Common application URL.**

## 5. Reporter

`reporter` controls how Playwright displays or generates test results. It is **not limited to HTML**.

Common reporters:

```text
list  → Shows detailed results in the terminal
line  → Shows compact results in the terminal
dot   → Shows a dot for each test
html  → Generates an interactive HTML report
json  → Generates results in JSON format
junit → Generates XML results for CI/CD tools
```

Multiple reporters can also be configured:

```typescript
reporter: [['list'], ['html']],
```

**Meaning:** Reporter = **How should we see or generate test results?**

## Example

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30 * 1000,
  retries: 1,
  reporter: 'html',

  use: {
    baseURL: 'https://demo.playwright.dev',
  },

  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
```

## What Should We NOT Do?

* ❌ Don't repeat the full `baseURL` in every test.
* ❌ Don't use unnecessary `page.waitForTimeout()` calls.
* ❌ Don't set different timeouts in every test without a reason.
* ❌ Don't use retries to hide genuine test failures.
* ❌ Don't create unnecessary projects.

**Easy way to remember:** `projects` = **where**, `timeout` = **how long**, `retries` = **how many times**, `baseURL` = **which application**, and `reporter` = **how results are shown**.
