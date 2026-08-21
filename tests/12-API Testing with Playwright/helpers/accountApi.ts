// helpers/accountApi.ts
//
// Small wrapper around Automation Exercise's account endpoints
// (https://automationexercise.com/api), reused by 05-chaining-api-calls-...
// and 07-hybrid-api-and-ui-testing, both of which need to create and
// clean up a throwaway account without repeating the same long form-field
// list in every test file.

import type { APIRequestContext } from '@playwright/test';

const BASE_URL = 'https://automationexercise.com';

export interface NewAccountInput {
  name: string;
  email: string;
  password: string;
}

export interface CreateAccountResponse {
  responseCode: number;
  message: string;
}

/** Creates a throwaway Automation Exercise account and returns the raw API response. */
export async function createAccount(
  request: APIRequestContext,
  input: NewAccountInput
): Promise<CreateAccountResponse> {
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
      firstname: firstName ?? input.name,
      lastname: rest.join(' ') || 'Test',
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

/** Deletes an account created with createAccount() — call this in cleanup so runs stay idempotent. */
export async function deleteAccount(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<void> {
  await request.delete(`${BASE_URL}/api/deleteAccount`, { form: { email, password } });
}
