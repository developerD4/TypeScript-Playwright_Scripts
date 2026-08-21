// 03-random-data-and-string-helpers.spec.ts
//
// TOPIC: utility/helper functions — random data generators, string helpers
//
// Framework code under test:
//   - framework/utils/randomDataGenerator.ts
//   - framework/utils/stringHelpers.ts
//
// Site used for the "real usage" test at the bottom:
//   https://www.saucedemo.com (see sites.txt #3)

import { test, expect } from '@playwright/test';
import {
  randomEmail,
  randomFromArray,
  randomFullName,
  randomId,
  randomInt,
  randomPassword,
  randomUsername,
} from '../../framework/utils/randomDataGenerator';
import { capitalize, normalizeWhitespace, stripCurrencySymbol, toKebabCase, truncate } from '../../framework/utils/stringHelpers';

test.describe('randomDataGenerator', () => {
  test('randomInt() stays within the given bounds, inclusive', () => {
    for (let i = 0; i < 50; i++) {
      const value = randomInt(1, 5);
      expect(value).toBeGreaterThanOrEqual(1);
      expect(value).toBeLessThanOrEqual(5);
    }
  });

  test('randomFromArray() only ever returns an item that was in the array', () => {
    const options = ['red', 'green', 'blue'] as const;
    const picked = randomFromArray(options);

    expect(options).toContain(picked);
  });

  test('randomEmail() and randomUsername() are unique across calls', () => {
    const emails = new Set(Array.from({ length: 20 }, () => randomEmail()));
    const usernames = new Set(Array.from({ length: 20 }, () => randomUsername()));

    // If randomId() weren't actually random, these Sets would be smaller
    // than 20 due to duplicate values collapsing.
    expect(emails.size).toBe(20);
    expect(usernames.size).toBe(20);
    expect(emails.values().next().value).toMatch(/^qa\.user\.\w+@example\.com$/);
  });

  test('randomFullName() returns non-empty first and last names', () => {
    const { firstName, lastName } = randomFullName();

    expect(firstName.length).toBeGreaterThan(0);
    expect(lastName.length).toBeGreaterThan(0);
  });

  test('randomPassword() respects the requested length', () => {
    expect(randomPassword(16)).toHaveLength(16);
    expect(randomPassword()).toHaveLength(12); // default
  });

  test('randomId() produces different values on repeated calls', () => {
    expect(randomId()).not.toBe(randomId());
  });
});

test.describe('stringHelpers', () => {
  test('capitalize() upper-cases only the first letter', () => {
    expect(capitalize('playwright')).toBe('Playwright');
    expect(capitalize('PLAYWRIGHT')).toBe('Playwright');
    expect(capitalize('')).toBe('');
  });

  test('toKebabCase() handles camelCase, spaces, and underscores', () => {
    expect(toKebabCase('helloWorld')).toBe('hello-world');
    expect(toKebabCase('Hello World')).toBe('hello-world');
    expect(toKebabCase('hello_world')).toBe('hello-world');
  });

  test('truncate() shortens long strings and appends a suffix', () => {
    expect(truncate('Playwright automation framework', 14)).toBe('Playwright ...');
    expect(truncate('short', 20)).toBe('short'); // unchanged when already short enough
  });

  test('normalizeWhitespace() collapses whitespace/newlines and trims', () => {
    expect(normalizeWhitespace('  Hello\n\n  World  ')).toBe('Hello World');
  });

  test('stripCurrencySymbol() extracts a numeric value from a price string', () => {
    expect(stripCurrencySymbol('$29.99')).toBe(29.99);
    expect(stripCurrencySymbol('Rs. 500')).toBe(500);
  });
});

test('real usage: fill a login form with a generated username', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  const madeUpUsername = randomUsername();
  await page.locator('#user-name').fill(madeUpUsername);

  // SauceDemo only accepts its own fixed set of usernames, so this
  // deliberately fails login and asserts on the resulting error — the
  // point here is showing randomUsername() feeding a real form field, not
  // achieving a successful login.
  await page.locator('#password').fill(randomPassword());
  await page.locator('#login-button').click();

  await expect(page.locator('[data-test="error"]')).toContainText('do not match');
});
