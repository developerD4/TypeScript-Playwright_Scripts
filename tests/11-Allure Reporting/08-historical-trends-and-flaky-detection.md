# 7. Analyzing Historical Trends and Flaky-Test Data on the Allure Dashboard

## This only works once history is being carried forward

Everything in this file depends on the "carry `history/` forward between
runs" mechanism from file 07 — without that step, the Allure dashboard's
trend widgets always show exactly one data point (this run), because
that's genuinely all the data that exists. This was verified directly
while building this repo's Allure integration:

```
run 1 → allure-report/widgets/history-trend.json:  [ {passed: 1, total: 1} ]
copy allure-report/history/ → allure-results/history/
run 2 (reusing that history) → history-trend.json:  [ {passed: 1, ...}, {passed: 1, ...} ]
```

Two runs, two data points — the trend graph is genuinely just "one point
per historical run," accumulated over time, nothing more magical than
that.

## What `history/` actually contains

Four files, copied forward each run (see file 07's pipeline step 2/5):

| File | What it tracks across runs |
|---|---|
| `history-trend.json` | pass/fail/broken/skipped COUNTS per run — the main trend graph |
| `duration-trend.json` | total suite duration per run — catches a suite silently getting slower over weeks |
| `retry-trend.json` | how many tests needed a retry to pass, per run — a proxy for overall suite flakiness |
| `categories-trend.json` | counts per CUSTOM category (file 08... see `categories.json` below) per run |

`history.json` (singular, inside `allure-results/` itself, not the
`history/` subfolder) is different: it's a per-TEST record — used to
match "this test" across runs by a stable ID, which is what lets Allure
say "test X went failed → passed → failed" over its last several runs,
not just aggregate pass/fail counts.

## Flaky-test detection specifically

A test is marked **flaky** in Allure's data model (see the `flaky: false`
field visible in `allure-report/data/behaviors.json` after generating —
referenced in file 03/04's verification) when it has a HISTORY of
inconsistent results for the SAME test identity across runs — most
directly, a test that needed a retry within a run (failed, then passed on
retry) or that has flipped status across recent historical runs.

Two related but different mechanisms:
- **Playwright's own `retries` config** (see
  `tests/08-Automation Framework Best Practices/04-flaky-test-root-cause-analysis.md`
  for the full root-cause workflow) — a test that fails then passes on
  retry, WITHIN one run, is what `retry-trend.json` and the `flaky` flag
  are most directly built from.
- **Allure's cross-run history** — a test that's consistently green for
  weeks, then fails once, then goes back to green, shows that pattern
  visually on its own history timeline on the dashboard, even without any
  Playwright-level retry ever happening.

Both answer the same underlying question — "is this failure a fluke or a
real regression?" — from two different signals.

## `categories.json` — organizing failures by TYPE, not just by test name

A raw pass/fail list of 40 failing tests is hard to act on. Categories
group failures by what actually caused them, using regex matching against
each result's status and message — this repo's example lives at
`allure-config/categories.json` in this folder:

```json
[
  { "name": "Product defects", "matchedStatuses": ["failed"], "messageRegex": ".*expect.*" },
  { "name": "Test defects (broken)", "matchedStatuses": ["broken"] },
  { "name": "Environment / network issues", "matchedStatuses": ["failed", "broken"],
    "messageRegex": "(?s).*(ECONNREFUSED|net::ERR_|timeout exceeded).*" },
  { "name": "Skipped", "matchedStatuses": ["skipped"] }
]
```

- `matchedStatuses` filters by Playwright's own result status
  (`failed` = an assertion didn't hold; `broken` = the test threw before
  even reaching an assertion, e.g. a `TypeError` in test setup).
- `messageRegex` further narrows by the actual error message — the
  "Environment / network issues" category above exists specifically to
  separate "the app under test has a real bug" from "the CI network
  hiccuped," which otherwise both just show up as generic red X's.

Copied into `allure-results/` before `generate` (same as
`environment.properties` — see file 07), this file was verified during
setup to parse and load correctly by the real `allure` CLI (confirmed via
`allure-report/data/categories.json` being populated after a `generate`
run) — it stayed empty in that verification only because the run behind
it had no failing results to categorize, which is the expected, correct
behavior for an all-green run.

## A practical reading order on the dashboard

1. **Trend graph (overview page)** — is the pass rate degrading over
   recent runs, or was this one run just unlucky?
2. **Categories** — of TODAY's failures, how many are real product bugs
   vs. environment noise vs. tests that are themselves broken?
3. **Retries widget** — which specific tests needed a retry — candidates
   for the root-cause workflow in
   `tests/08-Automation Framework Best Practices/04-flaky-test-root-cause-analysis.md`.
4. **A specific test's own history tab** — for one suspect test, its
   individual pass/fail pattern across the last N runs — is it ALWAYS
   flaky, or did something change recently?

## Discussion questions

1. Why did `categories-trend.json` stay empty in this repo's own
   verification run, and what would need to be true for it to show data?
2. What's the difference between "this test retried and passed" (within
   one run) and "this test has failed in 3 of its last 10 runs" (across
   many runs) — and which of file 07's mechanisms does each one depend on?
3. A category regex for "Environment / network issues" is too broad and
   starts catching real product bugs too. What's the practical fix?
