import { test, expect } from '@playwright/test';
import { createUser } from '../../framework/factories/userFactory';

test('create complete employee test data', () => {
  const user = createUser();

  expect(user.firstName).not.toBe('');
  expect(user.email).toContain('@example.com');
  expect(user.password).toBe('Password123!');
});

test('override only the value needed by the test', () => {
  const adminUser = createUser({
    firstName: 'David',
    email: 'admin.test@example.com',
  });

  expect(adminUser.firstName).toBe('David');
  expect(adminUser.email).toBe('admin.test@example.com');
  expect(adminUser.lastName).toBe('Test');
});

// The factory creates defaults first. The overrides replace only requested values.
