# 4. Debugging Tests Using the Official VS Code Playwright Extension

## Why this topic is a guide, not a spec file

This is about a piece of editor tooling (the "Playwright Test for VSCode"
extension, published by Microsoft), not a Playwright API — there's no
code to write or run here. It wraps the same Inspector/Trace Viewer
mechanics from files 02 and 03, but surfaces them directly inside VS
Code's UI instead of the terminal.

## Setup

1. Install the extension: search the Extensions panel (`Ctrl+Shift+X`)
   for **"Playwright Test for VSCode"**, or install from the command line:
   ```
   code --install-extension ms-playwright.playwright
   ```
2. Open this project's folder in VS Code. The extension auto-detects
   `playwright.config.ts` at the project root and reads its `projects`
   array (chromium/firefox/webkit — see this repo's config) to populate
   its Test Explorer.

## What it adds inside the editor

- **Inline run/debug icons** — every `test(...)` and `test.describe(...)`
  block in a `.spec.ts` file gets a small ▶ (run) and 🐞 (debug) icon in
  the gutter, right next to the line. No need to type a CLI command for a
  single test.
- **Test Explorer panel** — a tree view of every test file and test in the
  project (grouped by the same folder structure this repo uses, e.g. each
  numbered topic folder appears as its own group), with pass/fail status
  from the last run shown per test.
- **"Debug Test"** — clicking the 🐞 icon runs that ONE test headed, with
  the Playwright Inspector (file 03) opening automatically — equivalent to
  running `npx playwright test <file> --debug -g "<test name>"` from the
  terminal, without having to type the file path or test name yourself.
- **Real editor breakpoints** — click in the gutter to the left of a line
  number in your `.spec.ts` file (a page object file works too, e.g.
  `tests/07-Page Object Model (POM)/pages/LoginPage.ts`) to set a normal
  VS Code breakpoint. Run in debug mode and execution stops there with the
  full VS Code debugger — variable inspection, call stack, watch
  expressions — not just the Inspector's own controls.
- **Pick locator** — a command (`Playwright: Pick locator`, or a button in
  the extension's toolbar) that opens the browser against a URL you
  specify and lets you click an element to get its recommended locator
  string, pasted directly into your editor at the cursor.
- **Record new test** — opens a blank browser window, and as you click
  around manually, generates the corresponding Playwright test code live,
  which you can save directly into a new `.spec.ts` file. Useful for a
  first draft of a test for an unfamiliar page — you'd still clean it up
  afterward using this repo's conventions (see
  `tests/08-Automation Framework Best Practices/02-naming-conventions.md`
  for locator/test naming, and the POM topic for factoring it into a page
  object rather than leaving it as raw generated code).
- **Trace viewing inline** — after a test run, a failed test in Test
  Explorer shows a "View Trace" link that opens Trace Viewer (file 02)
  inside a VS Code tab, instead of needing to run
  `npx playwright show-trace` manually.
- **Show browser** toggle — runs tests headed (visible) by default from
  the extension, regardless of your `playwright.config.ts` headless
  setting, so you can watch what's happening without editing config files
  back and forth.

## A typical debugging loop in the editor

1. A test in Test Explorer shows red (failed) after a run.
2. Click "View Trace" to see what happened — same information as file 02,
   inline.
3. If the trace shows the WRONG locator was used, use "Pick locator"
   against the actual page to get the correct one.
4. Set a breakpoint on the failing line, click the 🐞 debug icon on that
   test, and step through with VS Code's normal debugger controls once
   execution reaches your breakpoint.
5. Fix the code, re-run via the inline ▶ icon — no context switch to a
   terminal needed for any of the steps above.

## Discussion questions

1. What does the VS Code extension give you that the terminal `--debug`
   flag (file 03) doesn't?
2. Why might "Record new test" output need cleanup before it fits this
   repo's conventions, rather than being committed as-is?
3. If a teammate without the extension installed reports a failing test,
   which artifact from this topic (file 01's HTML report, file 02's
   trace.zip) could you ask them to send you, so you can debug it in your
   own editor without needing to reproduce the failure yourself first?
