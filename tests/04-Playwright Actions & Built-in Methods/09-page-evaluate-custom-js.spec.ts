// 09-page-evaluate-custom-js.spec.ts
//
// TOPIC: executing custom JavaScript in the browser context with page.evaluate()
//
// Site used: https://demo.playwright.dev/todomvc (see sites.txt #1)
//
// page.evaluate(fn, arg) serializes `fn` and `arg`, sends them into the
// PAGE's own JavaScript context, runs it there (with access to `window`,
// `document`, etc.), then serializes the return value back to your test.
// Because it crosses that boundary, both the argument and the return value
// must be JSON-serializable — you can't pass or return things like
// functions, DOM nodes kept beyond the call, or class instances.

import { test, expect } from '@playwright/test';

test('evaluate() reads a value out of the page', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  const pageTitle = await page.evaluate(() => document.title);
  expect(pageTitle).toBe('React • TodoMVC');

  const viewportWidth = await page.evaluate(() => window.innerWidth);
  expect(viewportWidth).toBeGreaterThan(0);
});

test('evaluate() can take a serializable argument', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  // The second argument to evaluate() is passed into the browser function.
  // Only one argument slot is allowed, so bundle multiple values in an
  // object/array if you need more than one.
  const result = await page.evaluate(
    ({ a, b }) => a + b,
    { a: 2, b: 3 }
  );
  expect(result).toBe(5);
});

test('locator.evaluate() runs JS against a specific DOM element', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  const heading = page.locator('h1');

  // Unlike page.evaluate(), locator.evaluate() first resolves the locator
  // to a real element and passes THAT element into your function as its
  // first argument — handy for reading a computed style or a DOM property
  // that Playwright doesn't expose a dedicated API for.
  const headingColor = await heading.evaluate((el) => getComputedStyle(el).color);
  expect(headingColor).toMatch(/^rgba?\(/);
});

test('evaluate() can also trigger side effects on the page', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');

  // Prefer real user actions (click, fill, ...) wherever possible — they
  // exercise the same code paths a real user triggers. Reach for
  // evaluate()-driven side effects only for things Playwright has no
  // dedicated API for, such as directly invoking a page's own JS function
  // or scrolling by a specific pixel amount.
  await page.evaluate(() => window.scrollBy(0, 100));

  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeGreaterThanOrEqual(0);
});
