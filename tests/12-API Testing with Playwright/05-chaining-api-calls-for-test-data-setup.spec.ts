import { test, expect } from '@playwright/test';
import { createAccount, deleteAccount } from './helpers/accountApi';

/*
 * API chaining:
 * Use the result/data from one API call in the next API call.
 *
 * Common real-world use:
 * API → create test data
 * API/UI → use the data
 * API → clean up the data
 *
 * This is usually faster than creating test data through many UI screens.
 */

test('create account by API, then use it as test data', async ({ request }) => {
  const email = `qa.chain.${Date.now()}@example.com`;
  const password = 'Passw0rd!123';

  // 1. Create the data needed by the test.
  const created = await createAccount(request, {
    name: 'Chain Test User',
    email,
    password,
  });

  expect(created.responseCode).toBe(201);

  // 2. Use the created data in another API call.
  const verifyResponse = await request.post(
    'https://automationexercise.com/api/verifyLogin',
    { form: { email, password } }
  );

  const verifyBody = await verifyResponse.json();

  expect(verifyBody.responseCode).toBe(200);
  expect(verifyBody.message).toBe('User exists!');

  // 3. Clean up.
  await deleteAccount(request, email, password);
});

test('chain create -> read -> update -> read again', async ({ request }) => {
  const email = `qa.chain2.${Date.now()}@example.com`;
  const password = 'Passw0rd!123';

  await createAccount(request, {
    name: 'Original Name',
    email,
    password,
  });

  // Read the account created by the previous API call.
  const beforeResponse = await request.get(
    'https://automationexercise.com/api/getUserDetailByEmail',
    { params: { email } }
  );

  const beforeBody = await beforeResponse.json();
  expect(beforeBody.user.name).toBe('Original Name');

  // Update the same account.
  await request.put(
    'https://automationexercise.com/api/updateAccount',
    {
      form: {
        name: 'Updated Name',
        email,
        password,
        title: 'Mr',
        birth_date: '1',
        birth_month: '1',
        birth_year: '1990',
        firstname: 'Updated',
        lastname: 'Name',
        company: 'Example Co',
        address1: '123 Main St',
        address2: '',
        country: 'United States',
        zipcode: '10001',
        state: 'NY',
        city: 'New York',
        mobile_number: '5555550100',
      },
    }
  );

  // Read again and verify the update.
  const afterResponse = await request.get(
    'https://automationexercise.com/api/getUserDetailByEmail',
    { params: { email } }
  );

  const afterBody = await afterResponse.json();
  expect(afterBody.user.name).toBe('Updated Name');

  await deleteAccount(request, email, password);
});
