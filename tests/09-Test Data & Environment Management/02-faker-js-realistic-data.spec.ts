// 02-faker-js-realistic-data.spec.ts
//
// TOPIC: using Faker.js to generate realistic test data for forms and APIs
//
// Site used: https://automationexercise.com (see sites.txt #4)
//
// @faker-js/faker generates data that LOOKS real (plausible names,
// addresses, company names, phone numbers) instead of throwaway strings
// like "user123" or "test@test.com". This matters for two reasons:
//   1. Some forms actually validate shape (a phone field rejecting
//      non-numeric input, an email field requiring a real "@domain.tld"
//      pattern) — Faker's generators already match those shapes.
//   2. Test data that reads like a real record is much easier for a human
//      to recognize and reason about in a bug report or a screenshot than
//      "asdf1234".

import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('faker generates a plausible full name, email, and address', () => {
  const person = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    streetAddress: faker.location.streetAddress(),
    city: faker.location.city(),
  };

  // These aren't hardcoded — every run produces different (but always
  // realistically-shaped) values.
  expect(person.firstName.length).toBeGreaterThan(0);
  expect(person.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  expect(person.phone.length).toBeGreaterThan(0);
});

test('faker.internet.email() guarantees a unique, valid-looking address every call', () => {
  const emails = new Set(Array.from({ length: 50 }, () => faker.internet.email()));

  // 50 calls, 50 different values — safe to use in a signup test without
  // manually gluing a timestamp onto a hardcoded string yourself.
  expect(emails.size).toBe(50);
});

test('faker.seed() makes "random" data reproducible for debugging', () => {
  // Normally you WANT different data every run (that's the point of
  // on-the-fly generation — see file 01). But while debugging a single
  // failing case, pinning the seed makes Faker deterministic, so the same
  // "random" data reproduces exactly on every re-run.
  faker.seed(42);
  const first = faker.person.fullName();

  faker.seed(42);
  const second = faker.person.fullName();

  expect(first).toBe(second);
});

test('real usage: filling out a signup form with realistic generated data', async ({ page }) => {
  const fullName = faker.person.fullName();
  const email = faker.internet.email({ provider: 'example.com' });

  await page.goto('https://automationexercise.com/login');
  await page.locator('[data-qa="signup-name"]').fill(fullName);
  await page.locator('[data-qa="signup-email"]').fill(email);
  await page.locator('[data-qa="signup-button"]').click();

  await expect(page).toHaveURL(/signup/);
  await expect(page.locator('input[name="name"]')).toHaveValue(fullName);
});

test('real usage: building a realistic multi-field account details payload', async () => {
  // A form like automationexercise.com's "Enter Account Information" page
  // needs a whole bundle of realistic fields at once — Faker covers all
  // of them without inventing plausible-looking values by hand.
  const accountDetails = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    company: faker.company.name(),
    address: faker.location.streetAddress(),
    country: faker.helpers.arrayElement(['United States', 'Canada', 'Australia', 'India']),
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    mobileNumber: faker.phone.number(),
  };

  expect(Object.values(accountDetails).every((value) => String(value).length > 0)).toBe(true);
});
