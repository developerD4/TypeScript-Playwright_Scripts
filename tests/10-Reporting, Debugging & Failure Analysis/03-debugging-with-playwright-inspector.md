# 3. Debugging Using Playwright Inspector (`PWDEBUG=1`) and Step-Through Mode

## Why this topic is a guide, not a spec file

Every other file in this repo runs headlessly and unattended, which is
exactly what makes it possible to check them into a CI pipeline. The
Playwright Inspector is the opposite by design: it **pauses test
execution and opens an interactive window**, waiting for a human to click
"Resume" or "Step over." Putting a real, un-guarded `page.pause()` call
into one of this repo's spec files would make that ONE test hang forever
the moment it runs unattended (in CI, or in this training repo's own
verification runs) — so this file documents the workflow instead of
demonstrating it as a runnable test.

## Launching the Inspector

Two equivalent ways to open it:

```
# via the environment variable
PWDEBUG=1 npx playwright test 01-html-reporter-features-and-customization.spec.ts

# via the built-in CLI flag (does the same thing)
npx playwright test 01-html-reporter-features-and-customization.spec.ts --debug
```

Both:
- Force the browser to launch **headed** (visible), regardless of your
  config's `headless` setting.
- Open the separate **Playwright Inspector** window alongside it.
- **Pause the test immediately**, before the first action, waiting for you
  to press ▶ Resume.

## `page.pause()` — pausing at a SPECIFIC point in a test

Rather than pausing at the very start, you can drop a single line into a
test to pause exactly where you want to inspect state:

```ts
test('a checkout flow I want to step through', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await page.pause(); // <-- execution stops HERE, Inspector opens

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
});
```

Running this normally (headless, no `--debug`) still opens the Inspector
the moment `page.pause()` executes — you don't need `PWDEBUG=1` for
`page.pause()` specifically to work, though running headed makes the
browser itself visible alongside the Inspector too.

**Never leave a `page.pause()` in code that gets committed or run in
CI** — it will hang that run indefinitely waiting for a human who isn't
there. Treat it exactly like a debugger breakpoint: add it locally while
debugging, remove it before committing.

## What the Inspector window gives you

- **▶ Resume / Step over** — run to the next action, or run to completion.
- **Record** — turn on action recording; clicks/fills you make manually IN
  the browser get turned into generated Playwright code you can copy into
  your test.
- **Pick locator** — click any element in the browser and the Inspector
  shows you Playwright's recommended locator for it (the same "prefer
  `getByRole`/`getByTestId`" guidance from
  `tests/03-Locators/`), instead of guessing a selector by hand.
- **Explore** — hover elements to see their locator without clicking.
- A **log panel** showing exactly which locator/action Playwright is
  currently attempting, including retry attempts — the live version of
  what a saved trace shows you after the fact (see file 02, Trace Viewer,
  in this folder).

## Step-through mode vs. Trace Viewer — when to reach for which

| | Playwright Inspector | Trace Viewer |
|---|---|---|
| When | WHILE a test runs, live | AFTER a test has already run and finished |
| Needs the real browser running? | Yes | No — works from a saved `.zip` file alone |
| Good for | Exploring a NEW test/locator interactively, watching exactly where an existing test is currently getting stuck | Investigating a failure that already happened — especially a flaky one caught mid-CI, where you can't rerun it live |
| Can you pause and manually try locators? | Yes | No — it's a read-only recording |

A practical rule: reach for the **Inspector** while you're WRITING or
actively troubleshooting a test locally; reach for **Trace Viewer** to
understand a failure that already occurred (especially on CI, where you
weren't watching it live at all).

## Debugging just one test instead of a whole file

Combine `--debug` with `-g` (grep by test name) to avoid stepping through
every OTHER test in a file first:

```
npx playwright test checkout.spec.ts --debug -g "completes with valid payment info"
```

## Discussion questions

1. Why does `page.pause()` hang a CI run, and what specifically about
   CI makes that worse than it hanging on your own machine?
2. You're debugging a locator that Playwright can't seem to find. Which
   Inspector feature answers "what locator SHOULD I be using here"
   directly, without guessing?
3. A test failed once, in CI, and hasn't failed again since. Which tool
   from this file and file 02 actually helps here, and why can't the other
   one?
