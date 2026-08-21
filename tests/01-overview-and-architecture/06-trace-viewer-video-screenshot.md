# 6. Trace Viewer, Video, and Screenshot Capture — Architecture Under the Hood

## What's going on

When a test fails, "it failed" isn't very useful on its own — you want to see
*what the page looked like* and *what happened step by step*. Playwright can
capture three kinds of after-the-fact evidence, each recorded differently:

- **Screenshot**: a single image taken at a moment in time (e.g. on failure).
  Cheap — just one frame.
- **Video**: the browser's tab is recorded frame-by-frame for the whole test
  run, saved as a `.webm` file. More expensive than a screenshot, but shows
  motion/timing.
- **Trace**: the richest option. While the test runs, Playwright records a
  timeline of every action, every network request/response, console logs,
  DOM snapshots before/after each step, and screenshots — all bundled into a
  single `.zip` trace file. Opening it in the **Trace Viewer**
  (`npx playwright show-trace trace.zip`) gives you a scrubbable, DevTools-like
  time machine for the entire test.

Under the hood, tracing works by hooking into the same CDP/protocol layer
described in [sub-topic 1](01-playwright-architecture.md) — every command
Playwright sends to the browser, and every response, can be logged as it
happens, which is why the trace can reconstruct DOM state at each step
without re-running the test.

## Real-world analogy

A screenshot is a photo. A video is CCTV footage. A trace is more like a
flight recorder ("black box") — it doesn't just show you what things looked
like, it also logs every instrument reading (network calls, console output,
timing) so you can reconstruct exactly what the system was doing at any
instant.

## Comparison

| Capture type | Cost | What you get |
|---|---|---|
| Screenshot | Very low | One image |
| Video | Medium | Full playback of the tab |
| Trace | Higher, but usually only `on-first-retry` | Timeline + DOM snapshots + network + console, viewable in Trace Viewer |

## Why it matters

In CI, a flaky test that fails once in a hundred runs is nearly impossible to
debug from logs alone. Because tracing can be configured to only activate
`on-first-retry` (the project's default, see `playwright.config.ts`), you get
this rich debugging data exactly when you need it — on failure — without
paying the recording cost on every single passing run.

## Discussion questions

1. Why might a team choose `trace: 'on-first-retry'` instead of `trace: 'on'`
   (always recording) for a large CI suite?
2. If you only had a screenshot of a failed test (no trace, no video), what
   information would you be missing that a trace would have given you?
