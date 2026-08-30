# Multi-Browser Support — Chromium, Firefox, and WebKit

Playwright allows us to run the same test on different browser engines. The three main engines are **Chromium**, **Firefox**, and **WebKit**. Chromium is used by browsers such as Chrome and Edge, Firefox is used by Mozilla Firefox, and WebKit is the engine used by Safari. We don't need to write separate tests for each browser. We write the test **once**, and Playwright can run the same test against all three browsers. This helps us find browser-specific issues. For example, a website may work correctly in Chrome but have a problem in Safari. Playwright lets us test the same application across different browsers to catch such problems.

| Browser Engine | Common Browsers | Playwright Name |
| -------------- | --------------- | --------------- |
| Chromium       | Chrome, Edge    | `chromium`      |
| Firefox        | Firefox         | `firefox`       |
| WebKit         | Safari          | `webkit`        |

In `playwright.config.ts`, Playwright uses **projects** to define which browsers should run the tests. When we run the tests, Playwright can execute the same test on Chromium, Firefox, and WebKit.

**Simple idea:** Write the test **once** → Run it on **multiple browsers** → Find browser-specific problems.

For example:

```text
                    One Test
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Chromium       Firefox       WebKit
       (Chrome)                    (Safari)
```

Testing multiple browsers is important because real users may use different browsers. A test passing in Chrome does not always guarantee that the application will work correctly in Firefox or Safari.
