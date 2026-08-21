# 7. Guidelines for Long-Term Maintainability and Framework Scalability

## What "scalability" means for a test framework

Not "runs fast" (that's performance) — it means **adding the 500th test
is roughly as easy as adding the 5th.** A framework that scales well keeps
onboarding new tests cheap as the suite grows; one that doesn't gets
slower and riskier to extend over time, until people start avoiding
writing new tests altogether.

This repo's own structure, built up across the earlier topic folders, is
itself an example of most of these guidelines in practice — each
guideline below points at the folder that demonstrates it.

## 1. One-way dependency: tests depend on the framework, never the reverse

```
framework/  ──────depended-on-by──────>  tests/
```

`framework/utils/`, `framework/core/`, `framework/fixtures/` etc. (topic
06) never import anything from `tests/`. This is what keeps reusable code
*actually* reusable — the moment a utility starts depending on something
specific to one spec file, it stops being safely reusable anywhere else.

## 2. Group by responsibility, and keep each group narrow

`framework/config/`, `framework/logger/`, `framework/core/` (topic 06)
each hold exactly one *kind* of thing. `pages/`, `components/`,
`fixtures/` (topic 07) do the same for POM code. When someone asks "where
would the code for X live," the folder structure itself should answer
that — new contributors shouldn't need to ask a teammate.

## 3. Page objects/components as the seam between "how" and "what"

(topic 07) Page objects absorb every change to the UI's implementation
details (a selector, a flow, an extra step) behind a stable method name.
A production framework at scale might have 40 page objects and 400 tests
— when the UI changes, the fix count stays proportional to the number of
AFFECTED page objects, not the number of tests using them.

## 4. Config-driven, not hardcoded (topic 08, file 06)

Every environment-specific value (URLs, credentials, timeouts) flows
through one config module. At small scale this feels like overhead; at
the scale of "this suite now needs to run against 4 environments and 2
regions," it's the difference between a one-line env var change and a
grep-and-replace across hundreds of files.

## 5. Fixtures over manual setup, once repetition crosses file boundaries

(topics 06 & 07) A `beforeEach` DRYs up one file; a fixture (`test.extend()`)
DRYs up the whole suite. Reach for the heavier tool only once the lighter
one stops being enough — see 03-dry-principle.spec.ts in this folder for
where that line is.

## 6. CI-aware configuration from day one

```ts
// playwright.config.ts — commented out in this repo's starter config,
// but worth enabling deliberately for a real project:
forbidOnly: !!process.env.CI,       // a stray `test.only` can't silently skip the rest of the suite in CI
retries: process.env.CI ? 2 : 0,    // tolerate environmental flakiness on CI, fail fast locally while iterating
workers: process.env.CI ? 1 : undefined, // CI runners are often more resource-constrained than a dev machine
```
A framework that only ever ran on one developer's laptop tends to make
assumptions (available CPU cores, network speed, timing) that quietly
break the moment it runs somewhere else. Deciding these settings
deliberately — not leaving them at whatever the default happened to be —
is part of scaling to a team and a CI pipeline.

## 7. Tag and group tests so subsets can run independently

As a suite grows, "run everything" stops being a good default for every
situation (a quick pre-commit check needs a fast subset; a nightly run
can afford the whole thing). Playwright supports this via tags in the
test title and `--grep`:

```ts
test('checkout completes with valid payment info @smoke', async ({ page }) => { ... });
```
```
npx playwright test --grep @smoke
```
Decide on a small, consistent tag vocabulary (`@smoke`, `@regression`,
`@slow`) early — retrofitting tags onto hundreds of untagged tests later
is far more work than tagging as you go.

## 8. Treat test code with the same standards as production code

Code review, consistent naming (file 02 in this folder), no dead/commented-out
tests left indefinitely, and refactoring test helpers when they get messy
— exactly like you would for the application itself. A test suite that's
allowed to accumulate its own technical debt eventually becomes the thing
slowing the team down instead of the safety net protecting them.

## Discussion questions

1. Pick one guideline above and describe a symptom you'd observe in a
   suite that's been violating it for a year.
2. Why does guideline 1 (one-way dependency) matter MORE as a framework
   scales, rather than less?
3. What's the risk of adding CI-aware settings (guideline 6) only after
   the suite is already large and painful to run in CI, instead of from
   the start?
