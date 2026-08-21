# 3. Multi-Browser Support — Chromium, Firefox, and WebKit Engines

## What's going on

Real users don't all use the same browser. Playwright supports three
rendering **engines**, which together cover the vast majority of real-world
browsers:

| Engine    | Ships as (real-world browsers)      | Playwright project name |
|-----------|--------------------------------------|--------------------------|
| Chromium  | Google Chrome, Microsoft Edge, Brave | `chromium`               |
| Firefox   | Mozilla Firefox                      | `firefox`                |
| WebKit    | Apple Safari (macOS/iOS)              | `webkit`                 |

Instead of writing a separate test suite per browser, you write your tests
**once**, and Playwright's config (`projects` in `playwright.config.ts`) runs
that same suite against each engine. This is already set up for you when you
scaffold a project with `npm init playwright@latest` — look at the
`projects: []` array in `playwright.config.ts`.

## Real-world analogy

It's like translating one recipe (your test) into three kitchens with
different stoves (Chromium, Firefox, WebKit) — the steps are identical, but
each kitchen "executes" them with its own equipment, and occasionally the
result reveals a difference (a CSS quirk, a timing difference) that only
shows up on one stove.

## Why this matters

Bugs that only reproduce on Safari/WebKit are common (date pickers, flexbox
quirks, video/audio codec support) and are otherwise easy to miss if your
team only tests on Chrome during development. Running the same suite across
all three engines catches these before real users do, and it costs you
almost nothing extra to set up — the projects config handles it.

## Discussion questions

1. If a test passes on `chromium` and `firefox` but fails on `webkit`, what
   real-world browser's users would be affected?
2. Why is testing against WebKit useful even for a team that develops
   entirely on Windows or Linux (where Safari isn't installed)?
