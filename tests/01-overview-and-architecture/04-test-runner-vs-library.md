# Playwright Test Runner vs Playwright Library

There are two important parts to understand: **Playwright Library** and **Playwright Test Runner**. The **Playwright Library** provides APIs to control browsers, such as launching a browser, creating a context, opening a page, and clicking elements. The **Test Runner** is built on top of these browser-control capabilities and provides features needed for testing. In our Playwright projects, we normally use **`@playwright/test`** because it provides `test()`, `expect()`, fixtures such as `page` and `context`, test execution, retries, parallel execution, and reports.

Think of it like this: **Playwright Library = controls the browser**, while **`@playwright/test` = helps us write and run tests**.

| Feature                 | Playwright Library | `@playwright/test` |
| ----------------------- | ------------------ | ------------------ |
| Control browser         | Yes                | Yes                |
| `test()`                | No                 | Yes                |
| `expect()`              | No                 | Yes                |
| `page` fixture          | No                 | Yes                |
| `context` fixture       | No                 | Yes                |
| Test reports            | No                 | Yes                |
| Retries                 | No                 | Yes                |
| Parallel test execution | No                 | Yes                |

For our learning, focus mainly on **`@playwright/test`**. When we write `import { test, expect } from '@playwright/test';`, we are using the Playwright Test Runner. This is also where fixtures such as `page`, `context`, and `browser` come from. You may see code such as `chromium.launch()` in other examples; that is the lower-level browser-control approach and can be learned later.

**Simple idea:** `Playwright Library → controls the browser` and `@playwright/test → provides the tools to write and run tests`.


An API is a set of ready-made functions or commands that allows us to communicate with and use a software. API is a collection of ready-made functions provided by Playwright. These functions allow us to interact with the browser without knowing the internal implementation. For example, page.goto(), page.click(), and page.fill() are Playwright APIs. We call these APIs in our test, and Playwright takes care of communicating with the browser.


A fixture is a ready-to-use object or resource that Playwright provides to a test.
| Fixture   | Simple meaning              |
| --------- | --------------------------- |
| `page`    | A browser tab/page          |
| `context` | An isolated browser session |
| `browser` | Browser instance            |
| `request` | Used for API requests       |

Playwright Library → Provides APIs to control browsers, such as page.goto(), page.click(), and page.fill().
Playwright Test Runner → Provides tools to create, run, manage, and report tests, such as test(), expect(), fixtures, retries, and reports.