# 4. Identifying and Stabilizing Flaky Tests — Root Cause Analysis Techniques

## What "flaky" actually means

A flaky test is one that passes and fails **without any code change** —
same test, same code, different result on different runs. This is
different from a test that reliably fails (that's just a bug, in the app
or the test) — flakiness is specifically about *inconsistency*, which
makes it far more corrosive to trust in a suite: once a team stops
believing red means "something's actually wrong," they start ignoring
failures, including real ones.

## The most common root causes, roughly most → least frequent

1. **Missing or wrong waits — a race condition between the test and the page.**
   The test clicks/asserts before the page has actually reached the state
   the test expects. This is Playwright's *most preventable* flake source,
   because web-first assertions and auto-waiting (see
   `tests/05-Assertions & Validations/03-auto-retrying-assertions.spec.ts`)
   already solve most of it — flakiness here almost always traces back to
   a manual `page.waitForTimeout(n)` that guessed wrong, or a check using
   `.textContent()`/`.isVisible()` read once instead of an auto-retrying
   `expect(locator)...`.

   ```ts
   // ✗ guesses 2 seconds is "enough" — flaky under CI load, on a slow
   //   network, or once the page gets one more thing to load
   await page.locator('#submit').click();
   await page.waitForTimeout(2000);
   expect(await page.locator('.success-banner').isVisible()).toBe(true);

   // ✓ waits exactly as long as needed, no more, no less
   await page.locator('#submit').click();
   await expect(page.locator('.success-banner')).toBeVisible();
   ```

2. **Test interdependency** — see file 01 in this folder. A test that only
   passes when a specific OTHER test happened to run first (and leave
   behind the state it needs) will flake the moment run order changes —
   different worker count, `--shard`, test filtering, or Playwright's own
   scheduling.

3. **Shared/colliding test data.** Two tests (or two parallel runs of the
   same test) using the same hardcoded username/email/record ID step on
   each other. See file 01's idempotency example — a hardcoded signup
   email is a textbook version of this.

4. **Unstable selectors.** A locator based on visual position (`nth(2)`) or
   generated/unstable class names (`.css-1a2b3c`) breaks when the page's
   layout or build output changes in an UNRELATED way, and can also match
   inconsistently if the DOM re-renders between the query and the action.

5. **External dependencies you don't control.** A public demo site (like
   the ones this repo uses), a third-party ad script, a flaky CDN. You
   can't fix the dependency, but you CAN isolate your test from its
   noise — e.g. `page.route()` to block/stub the flaky part (see
   `tests/04-Playwright Actions & Built-in Methods/`'s network interception
   examples), or scope assertions to only what your test actually cares
   about.

6. **Environment/resource contention.** Too many parallel workers on a
   memory-constrained CI runner, animations that behave differently at
   different frame rates, a test timeout too close to how long the action
   legitimately takes under load.

## Root cause analysis workflow

1. **Reproduce reliably before touching anything.** A test that fails
   1-in-20 times needs to fail on demand to actually debug. Playwright's
   `--repeat-each=20` reruns the same test that many times in one command:
   ```
   npx playwright test path/to/flaky.spec.ts --repeat-each=20
   ```
2. **Turn on full diagnostics for the failing run.** Traces capture a full
   timeline (DOM snapshots, network, console) you can step through after
   the fact:
   ```ts
   // playwright.config.ts
   use: { trace: 'on-first-retry', video: 'retain-on-failure', screenshot: 'only-on-failure' }
   ```
   Then inspect a failure with:
   ```
   npx playwright show-trace test-results/.../trace.zip
   ```
3. **Narrow the blast radius with `test.step()`.** Wrapping logical
   phases in `test.step()` makes the trace timeline show exactly which
   PHASE failed, not just which test:
   ```ts
   await test.step('log in', async () => { ... });
   await test.step('add item to cart', async () => { ... });
   await test.step('check out', async () => { ... });
   ```
4. **Isolate the suspect from the rest of the suite.** Run the ONE test
   alone (`npx playwright test -g "the exact test name"`), then run it
   alongside its usual neighbors, then at full worker parallelism — if it
   only fails in one of those configurations, that narrows the cause to
   either interdependency (fails alongside neighbors) or resource
   contention (fails only at full parallelism).
5. **Bisect if the test used to be reliable.** `git bisect` across recent
   commits (application code AND test code) to find exactly when the
   flakiness was introduced, rather than guessing.
6. **Fix the root cause, not the symptom.** Setting `retries` in
   `playwright.config.ts` (or per-block via `test.describe.configure({ retries })`)
   can be a legitimate *mitigation* for genuinely environmental flakiness
   (a shared demo site hiccup), but reaching for retries FIRST — before
   understanding why a test is flaky — just hides the problem and slows
   the whole suite down. Retries are a last resort, not a first response.

## Discussion questions

1. Why does `--repeat-each` matter *before* you start adding fixes —
   what would happen if you "fixed" a flaky test without ever reproducing
   the failure first?
2. A test fails only when run with `--workers=4` but never with
   `--workers=1`. Which category from the list above does that point to?
3. Why is reaching for `retries` in the config a weak first move, even
   though it does make CI green again?
