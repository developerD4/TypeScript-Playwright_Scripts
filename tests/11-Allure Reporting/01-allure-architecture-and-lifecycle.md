# 1. Allure Reporting Architecture and the Report Generation Lifecycle

## The key idea: two separate phases, two separate tools

Allure is NOT one program that both runs your tests and shows you a
report — it's a **result format** plus a **separate report generator**
that reads that format. Understanding that split explains almost every
other Allure question (why results and reports are different folders, why
you regenerate the report without rerunning tests, why CI needs an extra
step beyond just `npx playwright test`).

```
┌─────────────────────┐        ┌──────────────────────┐        ┌────────────────────┐
│  1. TEST RUN         │        │  2. RESULT FILES      │        │  3. REPORT          │
│                      │  ───>  │                       │  ───>  │  GENERATION          │
│  npx playwright test │        │  allure-results/      │        │  npx allure generate │
│  (allure-playwright   │        │  *.json, *.txt,       │        │  (a separate CLI,     │
│   is a REPORTER,      │        │  *.png attachments    │        │   written in Java,    │
│   writing files as    │        │  — one JSON per test   │        │   bundled by the      │
│   tests execute)      │        │  result, plus raw      │        │   allure-commandline   │
│                      │        │  attachment files      │        │   npm package)         │
└─────────────────────┘        └──────────────────────┘        └────────────────────┘
                                                                            │
                                                                            ▼
                                                                 ┌────────────────────┐
                                                                 │  4. STATIC HTML SITE │
                                                                 │  allure-report/      │
                                                                 │  — open with          │
                                                                 │  `npx allure open`    │
                                                                 │  or host it anywhere  │
                                                                 └────────────────────┘
```

## Phase 1 & 2 — collecting results during the test run

`allure-playwright` (see file 02 in this folder) is a Playwright
**reporter**, exactly like the `'html'` or `'list'` reporters this repo
already uses (see `tests/10-Reporting, Debugging & Failure Analysis/01-...`).
Its whole job is: for every test that runs, write one raw JSON file (plus
any attachments — screenshots, custom data) into `allure-results/`. This
happens as a normal part of `npx playwright test` — no extra step, no
Java involved yet.

```
allure-results/
├── 3f2a91-result.json      ← one test's full result: status, steps, labels, timing
├── 3f2a91-attachment.png   ← a screenshot referenced by that result
├── b7c810-result.json      ← another test's result
└── ...
```

This directory is **intermediate data**, not a report — opening one of
these JSON files directly isn't useful to a human. It's also why
`allure-results/` is normally listed in `.gitignore`: it's regenerated
every run, just like `test-results/` and `playwright-report/` already are
in this repo's `.gitignore`.

## Phase 3 & 4 — turning results into a report

A completely separate program, the **Allure CLI** (written in Java —
that's why `java -version` needs to succeed on the machine generating the
report), reads every file in `allure-results/` and builds a static HTML
site from them:

```
npx allure generate ./allure-results --clean -o ./allure-report
npx allure open ./allure-report
```

`generate` never talks to your browser, your app under test, or
Playwright at all — it's a pure offline transformation, `allure-results/`
(JSON) in, `allure-report/` (HTML/JS/CSS) out. That's why you can:
- Regenerate the report from the SAME results as many times as you want,
  without rerunning any tests.
- Generate the report on a completely different machine than the one that
  ran the tests (common in CI — see file 06), as long as you copy
  `allure-results/` over first.
- Merge `allure-results/` from SEVERAL separate test runs (e.g. sharded
  across multiple CI machines) into one combined report, just by putting
  all their result files in the same folder before running `generate`.

## Where this repo fits in

- `playwright.config.ts`'s `reporter` array includes
  `['allure-playwright', { resultsDir: 'allure-results', ... }]` alongside
  the `list`/`html` reporters from topic 10 — all three run from the SAME
  test run, each producing its own independent output.
- `package.json` has `allure:generate` / `allure:open` / `allure:serve`
  scripts wrapping the two CLI commands above.

## Discussion questions

1. Why doesn't regenerating the Allure report require rerunning any tests?
2. If two CI machines each ran half the suite, what would you do with
   their two separate `allure-results/` folders to get ONE combined report?
3. Why is `allure-results/` normally gitignored, the same way
   `test-results/` already is in this repo?
