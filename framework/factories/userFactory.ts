// Create valid employee data in one place.

import {
  generateRandomEmail,
  generateRandomFirstName,
  generateRandomUsername,
} from '../utils/randomDataGenerator';

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export function createUser(overrides: Partial<User> = {}): User {
  const firstName = generateRandomFirstName();

  return {
    firstName,
    lastName: 'Test',
    username: generateRandomUsername(firstName),
    email: generateRandomEmail(firstName),
    password: 'Password123!',
    ...overrides,
  };
}

//A data factory is a reusable function that creates test data when needed.
