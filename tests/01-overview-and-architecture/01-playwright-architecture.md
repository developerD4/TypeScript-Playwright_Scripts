# 1. Playwright Architecture — CDP for Chromium, Custom Protocols for Firefox/WebKit

## What's going on

When you write `await page.click('button')`, Playwright doesn't type into your
keyboard or move a physical mouse. It sends a command over a **protocol** to the
real browser engine, and the browser executes it internally.

- For **Chromium** (Chrome, Edge), Playwright talks to the browser using the
  **Chrome DevTools Protocol (CDP)** — the same protocol Chrome's own DevTools
  panel uses to inspect and control the page. It's a rich, official protocol
  that exposes almost everything the browser can do.
- For **Firefox** and **WebKit** (Safari's engine), there is no equivalent public
  protocol. So the Playwright team patches these browsers with custom build
  changes and communicates with them through **Playwright's own internal
  protocols**, purpose-built to give the same level of control CDP gives for
  Chromium.

This is a key reason Playwright ships its own downloaded browser binaries
(via `npx playwright install`) instead of just using whatever browser is
already on your machine — the Firefox and WebKit builds contain patches that
regular downloads don't have.

## Real-world analogy

Think of CDP like a hotel that already has a maintenance intercom built into
every room — Playwright just picks up the phone and gives instructions.
Firefox and WebKit are more like hotels that never installed that intercom
system, so the Playwright team had to run their own wiring through the walls
(patching the browser) before they could "call" it the same way.

## How a command flows

```
Your test code
     │  page.click('button')
     ▼
Playwright Node.js library
     │  translates to protocol message
     ▼
CDP (Chromium)  |  Custom protocol (Firefox/WebKit)
     │
     ▼
Real browser engine executes the click
```

## Why it matters in real projects

Because Playwright controls the browser at this low protocol level (rather
than simulating input from the OS), it can do things that are hard for older
tools: intercept network requests, wait precisely for the DOM to settle, and
run headless or headed with identical behavior. Understanding this also
explains why Playwright needs its own browser binaries — "it works in my
Chrome" isn't quite the same statement as "it works in Playwright's Chromium."

## Discussion questions

1. Why can't Playwright just use CDP for Firefox and WebKit too?
2. What practical consequence does "Playwright ships its own browser
   binaries" have for how you set up a CI machine?
