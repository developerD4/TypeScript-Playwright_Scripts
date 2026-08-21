// 02-date-utils.spec.ts
//
// TOPIC: utility/helper functions — date utilities
//
// Framework code under test: framework/utils/dateUtils.ts
//
// These are plain functions with no dependency on a browser page, so the
// tests below don't need the `page` fixture at all — a reminder that not
// every Playwright test has to drive a browser. Pure logic like this is
// exactly what belongs in framework/utils/, tested in isolation.

import { test, expect } from '@playwright/test';
import { addDays, fileSafeTimestamp, formatDate, isoTimestamp } from '../../framework/utils/dateUtils';

test('formatDate() formats a known date in both supported patterns', () => {
  const date = new Date(2026, 0, 5); // January 5, 2026 (month is 0-indexed)

  expect(formatDate(date, 'YYYY-MM-DD')).toBe('2026-01-05');
  expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/05/2026');
});

test('formatDate() pads single-digit months and days', () => {
  const date = new Date(2026, 8, 3); // September 3, 2026
  expect(formatDate(date)).toBe('2026-09-03');
});

test('addDays() moves a date forward, including across month boundaries', () => {
  const jan30 = new Date(2026, 0, 30);
  const result = addDays(jan30, 5);

  expect(formatDate(result)).toBe('2026-02-04');
});

test('addDays() with a negative number moves the date backward', () => {
  const marchFirst = new Date(2026, 2, 1);
  const result = addDays(marchFirst, -1);

  expect(formatDate(result)).toBe('2026-02-28');
});

test('isoTimestamp() returns a valid, parseable ISO 8601 string', () => {
  const timestamp = isoTimestamp();

  expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  expect(Number.isNaN(new Date(timestamp).getTime())).toBe(false);
});

test('fileSafeTimestamp() produces a string safe to use in a file name', () => {
  const timestamp = fileSafeTimestamp(new Date(2026, 0, 5, 10, 30, 0));

  // No colons or dots — both are invalid/awkward in file names on some
  // filesystems (Windows in particular forbids ':').
  expect(timestamp).not.toContain(':');
  expect(timestamp.includes('.')).toBe(false);
});
