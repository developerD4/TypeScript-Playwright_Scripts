# 4. Playwright Test Runner vs Playwright Library (playwright-core)

## What's going on

"Playwright" actually refers to two different things people install:

- **`playwright-core`** (the "library"): just the low-level API for driving a
  browser — `chromium.launch()`, `browser.newContext()`, `page.click()`, etc.
  It has no idea what a "test" is, no assertions, no test runner, no HTML
  report. You could use it to build a web scraper or an automation script
  that has nothing to do with testing.
- **`@playwright/test`** (the "Test Runner"): built ON TOP of the library. It
  adds everything you associate with writing tests — `test()`, `expect()`,
  fixtures like `page`/`context`, parallel execution, retries, the
  `playwright.config.ts` file, the HTML reporter, and the Trace Viewer
  integration.

When you ran `npm init playwright@latest`, it installed `@playwright/test`
(which pulls in `playwright-core` internally) — that's why your test files
can just `import { test, expect } from '@playwright/test'` and get fixtures
like `page` for free.

## Real-world analogy

`playwright-core` is like a car engine and steering wheel sold on their own —
powerful, but you have to build the dashboard, seatbelts, and instructions
yourself. `@playwright/test` is the whole car: same engine underneath, but
with a dashboard (reporters), seatbelts (retries/assertions), and a manual
(fixtures) already built around it.

## Comparison

| | `playwright-core` | `@playwright/test` |
|---|---|---|
| Launches browsers | Yes | Yes (via core internally) |
| Has `test()` / `describe()` | No | Yes |
| Has `expect()` assertions | No (use Node's `assert` yourself) | Yes, with auto-retrying matchers |
| Parallelization, retries | You build it | Built in |
| HTML report / Trace Viewer | You build it | Built in |
| Typical use case | Scraping, custom automation scripts | Writing and running a test suite |

## Why it matters

Knowing this distinction helps when reading Playwright docs or third-party
code: some snippets you'll find online use bare `playwright-core` style
(`const browser = await chromium.launch()`), while your project's actual
tests use the Test Runner style (`test('...', async ({ page }) => {...})`).
Mixing the two mental models is a common source of confusion for beginners.

## Discussion questions

1. If you needed to write a Node.js script that logs into a site nightly and
   downloads a report — no test assertions involved — would you reach for
   `playwright-core` or `@playwright/test`? Why?
2. Where does the `page` fixture you use in every test actually come from?
