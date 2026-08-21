# 7. Project Setup Using `npm init playwright@latest`

## What's going on

`npm init playwright@latest` is the official scaffolding command that sets
up a working Playwright Test project in one step. It's already been run for
this repo — this section explains what it did and why each piece exists, so
the generated files aren't a mystery.

Running it asks a few questions (TypeScript or JavaScript, test folder name,
add a GitHub Actions workflow?, install browsers now?) and then generates:

- **`playwright.config.ts`** — central configuration: which browsers to test
  against, timeouts, retries, base URL, reporters. Covered in detail in
  [sub-topic 8](08-playwright-config.spec.ts).
- **`tests/`** — folder where your `.spec.ts` test files live (matches
  `testDir` in the config).
- **`tests-examples/`** — sample tests generated to show idiomatic style
  (safe to delete once you're comfortable).
- **`package.json`** — gets `@playwright/test` (and `@types/node`) added as a
  dev dependency.
- Downloads the actual browser binaries (Chromium, Firefox, WebKit) into a
  local Playwright cache, via `npx playwright install`.

## Real-world analogy

It's the equivalent of `create-react-app` or `npm create vite@latest` for
front-end projects — a scaffolding tool that saves you from hand-writing
boilerplate config and folder structure, and gets you to a runnable "hello
world" test in under a minute.

## Why it matters

Understanding what the scaffold actually generated (rather than treating it
as a black box) means that when you need to change the test folder,
reconfigure a browser project, or add a CI reporter later, you know exactly
which generated file to open — instead of re-running the init command or
guessing.

## Discussion questions

1. What command would you run to (re)install just the browser binaries
   without re-scaffolding the whole project?
2. Which generated file would you open to change how long a test is allowed
   to run before timing out?
