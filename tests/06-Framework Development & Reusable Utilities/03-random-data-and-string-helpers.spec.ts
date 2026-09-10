import { test, expect } from '@playwright/test';
import {
  generateRandomEmail,
  generateRandomFirstName,
  generateRandomUsername,
} from '../../framework/utils/randomDataGenerator';
import { normalizeWhitespace, removeCurrencySymbol } from '../../framework/utils/stringHelpers';

test('generate unique employee data', () => {
  const firstName = generateRandomFirstName();
  const email = generateRandomEmail(firstName, 'orangehrm.test');
  const username = generateRandomUsername(firstName);

  expect(email).toContain('@orangehrm.test');
  expect(username).toContain(firstName.toLowerCase());
});

test('clean values read from the application', () => {
  expect(normalizeWhitespace('  Employee\n  created  ')).toBe('Employee created');
  expect(removeCurrencySymbol('Rs. 1,250.50')).toBe(1250.5);
});

// Data flow: test -> utility -> generated/clean value -> fill() or expect().
