import type { APIRequestContext } from '@playwright/test';

/*
 * Helper:
 * Keeps repeated API setup/cleanup code in one place.
 * The tests can call createAccount() and deleteAccount() instead of
 * repeating the long form-data object.
 */

const BASE_URL = 'https://automationexercise.com';

export interface NewAccountInput {
  name: string;
  email: string;
  password: string;
}

export async function createAccount(
  request: APIRequestContext,
  input: NewAccountInput
) {
  // Sends the POST request needed to create an account.
  const [firstName, ...rest] = input.name.split(' ');

  const response = await request.post(`${BASE_URL}/api/createAccount`, {
    form: {
      name: input.name,
      email: input.email,
      password: input.password,
      title: 'Mr',
      birth_date: '1',
      birth_month: '1',
      birth_year: '1990',
      firstname: firstName || 'Test',
      lastname: rest.join(' ') || 'User',
      company: 'Example Co',
      address1: '123 Main St',
      address2: '',
      country: 'United States',
      zipcode: '10001',
      state: 'NY',
      city: 'New York',
      mobile_number: '5555550100',
    },
  });

  return response.json();
}

export async function deleteAccount(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<void> {
  // Removes test data during cleanup.
  await request.delete(`${BASE_URL}/api/deleteAccount`, {
    form: { email, password },
  });
}
