import { test, expect } from '@playwright/test';
import { addDays, formatDate, getTodayDate } from '../../framework/utils/dateUtils';

test('format a date for an application field', () => {
  const joiningDate = new Date(2026, 0, 5);

  expect(formatDate(joiningDate)).toBe('2026-01-05');
  expect(formatDate(joiningDate, '/')).toBe('2026/01/05');
});

test('create a future date for test data', () => {
  const today = new Date(2026, 0, 5);
  const leaveDate = addDays(today, 7);

  expect(formatDate(leaveDate)).toBe('2026-01-12');
});

test('get today as reusable text', () => {
  expect(getTodayDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

// Data flow: test -> addDays() -> formatDate() -> value ready for a date field.
