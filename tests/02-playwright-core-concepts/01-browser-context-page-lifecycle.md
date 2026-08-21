# 1. Browser, BrowserContext, and Page Objects — Lifecycle and Relationship in Tests

## What's going on

You already saw in Topic 1 that Browser → BrowserContext → Page is a
containment hierarchy. This sub-topic is about *when* each one is actually
created and destroyed while your test suite runs — because that timing is
what makes Playwright Test both fast and safe from state leaking between
tests.

By default, when you run `npx playwright test`:

- One **Browser** process is launched **per worker process** (Playwright
  Test runs multiple workers in parallel — see
  [sub-topic 5](05-parallelism-workers.md)), and is reused across every test
  that worker executes. Launching a browser process is the slow part, so
  reusing it saves time.
- A brand new **BrowserContext** is created **before every single test**, and
  destroyed **after that test finishes** — this is what the `context` and
  `page` fixtures hand you. This is why cookies, localStorage, or a logged-in
  session from one test never bleed into the next.
- A **Page** is created inside that fresh context (the `page` fixture opens
  one for you automatically).

```
Worker process
 └── Browser (launched once, reused)
      ├── BrowserContext  (created for Test A, destroyed after Test A)
      │     └── Page
      ├── BrowserContext  (created for Test B, destroyed after Test B)
      │     └── Page
      └── ...
```

## Real-world analogy

The Browser is like a hotel building that stays open all week (expensive to
construct, so you don't rebuild it for every guest). Each BrowserContext is
like a hotel room freshly cleaned and reset before every new guest (test)
checks in — no belongings (cookies/storage) left behind by the previous
guest. The Page is the guest actually using the room.

## Why it matters

If you ever manually create extra `browser.newContext()` calls or reuse a
`page` across what should be independent tests, you break this isolation
guarantee and can get flaky, order-dependent test failures. Understanding
"one browser, many disposable contexts" is the mental model that explains
why Playwright tests are both fast (browser reuse) and reliable (context
isolation) at the same time.

## Discussion questions

1. Why is a fresh BrowserContext per test cheaper than launching a fresh
   Browser per test?
2. If a test manually calls `browser.newContext()` a second time inside
   itself, how many contexts now exist for that one test, and what could go
   wrong?
