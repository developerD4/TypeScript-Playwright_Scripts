# 6. Generating and Publishing Allure Reports Within a CI/CD Pipeline

## The core problem: CI is stateless, but trend graphs need history

Everything from files 01-05 works fine on a single local run. CI adds two
real complications:
1. **The machine that generates the report may not be the machine that
   ran the tests** — a good reason to run/generate as separate steps.
2. **Trend graphs and flaky-test history (file 08) need data from
   PREVIOUS runs** — but a fresh CI job starts with an empty filesystem
   every time. Without deliberately carrying history forward, every
   report looks like the suite's very first run, forever.

## The pipeline shape, step by step

```
1. npx playwright test                 → allure-results/ (this run's raw data)
2. copy PREVIOUS run's history into    → allure-results/history/
   allure-results/history/                (see "Carrying history forward" below)
3. npm run allure:generate             → allure-report/ (a static site,
                                          NOW including trend graphs)
4. publish allure-report/               → GitHub Pages / S3 / an internal
                                          static host / a CI artifact
5. save allure-report/history/ somewhere → becomes step 2's input on the NEXT run
   persistent, for the NEXT run to pick up
```

Step 2 and 5 are the part that's easy to forget — skip them and the
pipeline still "works" (a report gets published every time), but trend
graphs and flaky detection (file 08) never accumulate more than one run
of data.

## Example: GitHub Actions

```yaml
# .github/workflows/tests.yml — illustrative, not wired into this repo's
# actual CI (this repo doesn't currently have a workflows folder).
name: tests
on: [push]

jobs:
  playwright:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - run: npm ci
      - run: npx playwright install --with-deps

      # Pull down last run's history so trend graphs have something to
      # compare against — stored from a PREVIOUS run's "Save report
      # history" step below. gh-pages is one common place to keep it,
      # since it's already a static hosting target for step 4.
      - name: Restore previous Allure history
        uses: actions/checkout@v4
        continue-on-error: true # first-ever run has nothing to restore yet
        with:
          ref: gh-pages
          path: gh-pages-previous

      - run: npx playwright test
        continue-on-error: true # let the pipeline reach the reporting steps even if tests fail

      - name: Seed this run's history from the previous report
        run: |
          mkdir -p allure-results/history
          cp -r gh-pages-previous/history/* allure-results/history/ 2>/dev/null || true
          cp "tests/11-Allure Reporting/allure-config/environment.properties" allure-results/
          cp "tests/11-Allure Reporting/allure-config/categories.json" allure-results/

      - run: npm run allure:generate

      - name: Publish report to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./allure-report
          keep_files: false
```

Key details that make this actually work:
- `continue-on-error: true` on the TEST step — if tests fail but the
  pipeline stops immediately, no report ever gets generated FOR that
  failure, which is exactly the run you'd most want a report for.
- Environment/category config (files created for this repo in
  `allure-config/environment.properties` and `allure-config/categories.json`)
  get copied into `allure-results/` as a build step, not committed
  directly into that folder — because `allure-results/` itself is
  gitignored and regenerated every run (see file 01).
- Publishing to `gh-pages` doubles as BOTH "publish this run's report"
  AND "the source of history for the NEXT run" — the same branch serves
  both purposes, avoiding a separate storage mechanism.

## The single-command alternative for local/simple CI

For a CI setup that doesn't need persistent trend history (e.g. a small
project, or one that's fine with `npm run allure:serve`'s report being
throwaway), skip the history-carrying steps entirely:

```
npx playwright test
npm run allure:generate
# then upload allure-report/ as a CI artifact for a human to download and open
```

This is simpler, and often the right starting point — add history/trend
persistence (file 08) once the team actually wants to look at trends
across runs, not before.

## Discussion questions

1. Why does the test step above need `continue-on-error: true` for the
   Allure report to be useful?
2. What specifically would go wrong (not crash, just silently not work)
   if you generated the report but skipped copying `history/` forward?
3. Why is `gh-pages` a convenient single place for both publishing the
   CURRENT report and sourcing history for the NEXT one?
