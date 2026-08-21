// custom-matchers.ts
//
// Shared home for custom expect() matchers, extended from Playwright's own
// `expect`. Keeping this in its own file (rather than inline in a spec) is
// the recommended pattern: any spec that needs these matchers imports
// `test`/`expect` from HERE instead of from '@playwright/test' directly,
// and gets everything Playwright's expect already provides PLUS these.
//
// See: https://playwright.dev/docs/test-assertions#add-custom-matchers-using-expectextend

import { test as base, expect as baseExpect, type Locator } from '@playwright/test';

// Type declarations so TypeScript knows about the new matchers wherever
// this `expect` is used — without this, `.toBeWithinRange(...)` etc. would
// be a type error even though it works fine at runtime.
declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      toBeWithinRange(floor: number, ceiling: number): R;
      toHaveItemCount(expected: number, options?: { timeout?: number }): Promise<R>;
    }
  }
}

export const test = base;

export const expect = baseExpect.extend({
  // A plain SYNCHRONOUS matcher — no waiting/retrying involved, just a
  // custom pass/fail rule over a value you already have in hand.
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be within range ${floor}-${ceiling}`
          : `expected ${received} to be within range ${floor}-${ceiling}`,
    };
  },

  // An ASYNC, AUTO-RETRYING matcher over a Locator. Modeled on Playwright's
  // own web-first assertions: it keeps re-checking the locator's count
  // until it matches (or the timeout runs out), instead of checking once
  // and immediately failing — the same flakiness-reduction benefit built-in
  // matchers like toHaveCount() give you.
  async toHaveItemCount(locator: Locator, expected: number, options?: { timeout?: number }) {
    const timeout = options?.timeout ?? 5000;
    const start = Date.now();
    let actual = await locator.count();

    while (actual !== expected && Date.now() - start < timeout) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      actual = await locator.count();
    }

    const pass = actual === expected;
    return {
      pass,
      message: () =>
        pass
          ? `expected locator not to have item count ${expected}`
          : `expected locator to have item count ${expected}, but got ${actual} (waited ${timeout}ms)`,
    };
  },
});
