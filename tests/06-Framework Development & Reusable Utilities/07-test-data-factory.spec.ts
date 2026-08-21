// 07-test-data-factory.spec.ts
//
// TOPIC: test data builder/factory pattern for generating structured test inputs
//
// Framework code under test: framework/factories/userFactory.ts
// Site used: https://automationexercise.com/login (see sites.txt #4)
//   Its signup form accepts arbitrary name/email — unlike SauceDemo, which
//   only accepts a fixed set of usernames — so it's a good fit for
//   demonstrating factory-generated data flowing into a real form.

import { test, expect } from '@playwright/test';
import { createRandomUser, UserBuilder } from '../../framework/factories/userFactory';

test('createRandomUser() returns a fully-populated user with sensible defaults', () => {
  const user = createRandomUser();

  expect(user.firstName.length).toBeGreaterThan(0);
  expect(user.lastName.length).toBeGreaterThan(0);
  expect(user.email).toContain('@');
  expect(user.username.length).toBeGreaterThan(0);
  expect(user.password.length).toBeGreaterThanOrEqual(8);
});

test('createRandomUser() lets a test override just the fields it cares about', () => {
  const user = createRandomUser({ email: 'fixed.address@example.com' });

  // Only email was overridden — everything else still comes from the
  // factory's random defaults, so the test doesn't have to specify fields
  // it doesn't actually care about.
  expect(user.email).toBe('fixed.address@example.com');
  expect(user.firstName.length).toBeGreaterThan(0);
});

test('UserBuilder chains .withX() calls to build one specific user', () => {
  const user = new UserBuilder()
    .withFirstName('Jane')
    .withLastName('Doe')
    .withEmail('jane.doe@example.com')
    .build();

  expect(user).toMatchObject({
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
  });
  // username/password were left as the builder's random defaults.
  expect(user.username.length).toBeGreaterThan(0);
});

test('two calls to createRandomUser() never collide on unique fields', () => {
  const userA = createRandomUser();
  const userB = createRandomUser();

  expect(userA.email).not.toBe(userB.email);
  expect(userA.username).not.toBe(userB.username);
});

test('real usage: a factory-built user fills out a real signup form', async ({ page }) => {
  const newUser = createRandomUser();

  await page.goto('https://automationexercise.com/login');

  await page.locator('[data-qa="signup-name"]').fill(`${newUser.firstName} ${newUser.lastName}`);
  await page.locator('[data-qa="signup-email"]').fill(newUser.email);
  await page.locator('[data-qa="signup-button"]').click();

  // The next page is the detailed "Enter Account Information" form, which
  // pre-fills the name we just submitted — confirming our factory-built
  // data actually made it through the form submission.
  await expect(page.locator('input[name="name"]')).toHaveValue(`${newUser.firstName} ${newUser.lastName}`);
});
