# 5. Parallelism & Workers Configuration for Faster Execution

## What's going on

Running hundreds of tests one after another would be slow. Playwright Test
runs multiple **workers** — separate processes, each with its own Browser
instance — in parallel, spreading your test files across them.

Relevant `playwright.config.ts` settings (already present in this project):

- `fullyParallel: true` — run individual TESTS in parallel, not just test
  FILES. Without this, tests within one file run sequentially even if
  multiple workers are available.
- `workers` — how many worker processes to run at once. Locally this
  defaults to roughly half your CPU cores; on CI it's often explicitly set
  lower (`workers: process.env.CI ? 1 : undefined`) because CI machines
  often have fewer usable cores and shared resources.
- `retries` — how many times a FAILED test is re-run (each retry happens in
  a fresh context) before being marked as truly failed — helps absorb
  occasional flakiness without slowing down every run.

Tests in the SAME file, by default, run in the same worker unless
`fullyParallel` is on — because Playwright assumes tests in one file might
share `describe.serial` ordering or file-scoped state, and only parallelizes
further when you tell it that's safe.

## Real-world analogy

Think of workers like checkout lanes at a supermarket. More open lanes
(workers) means the whole line of customers (tests) gets through faster —
but if you open more lanes than you have cashiers (CPU cores) for, each lane
actually slows down because they're fighting over the same resources.

## Comparison

| Setting | Effect | Typical local value | Typical CI value |
|---|---|---|---|
| `workers` | # parallel processes | auto (≈ half your cores) | often `1` or a fixed small number |
| `fullyParallel` | parallelize within a file too | `true` | `true` |
| `retries` | re-attempts on failure | `0` | `2` (absorbs CI flakiness) |

## Why it matters

A slow test suite discourages developers from running it locally before
pushing, and a flaky suite erodes trust in CI. Tuning `workers`/`retries`
correctly is often the single biggest lever for "does the team actually
trust and use this test suite," separate from how well any individual test
is written.

## Discussion questions

1. Why might a CI machine be configured with `workers: 1` even though the
   local dev machine uses several?
2. If a test relies on `describe.serial` ordering (each test depends on the
   previous one's state), is that test a good candidate for
   `fullyParallel`? Why or why not?
