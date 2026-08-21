// 02-get-post-put-delete-with-request-fixture.spec.ts
//
// TOPIC: sending GET/POST/PUT/DELETE requests using the request fixture
//
// Site used: https://automationexercise.com/api (see sites.txt #4)
//   Its account endpoints exercise all four verbs against the same
//   resource (a user account), which is exactly what this topic needs to
//   demonstrate cleanly: create it (POST), read it (GET), modify it
//   (PUT), remove it (DELETE).

import { test, expect } from '@playwright/test';

function uniqueEmail(prefix: string): string {
  return `qa.${prefix}.${Date.now()}@example.com`;
}

test('GET — fetching a resource, optionally with query parameters', async ({ request }) => {
  const response = await request.get('https://automationexercise.com/api/productsList');
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(Array.isArray(body.products)).toBe(true);
});

test('POST — creating a resource, with a form-encoded request body', async ({ request }) => {
  const email = uniqueEmail('post');

  // `form` sends this as application/x-www-form-urlencoded, matching what
  // this specific API expects (confirmed by trying it — some APIs expect
  // `data` as raw JSON instead; check the target API's own docs/behavior).
  const response = await request.post('https://automationexercise.com/api/createAccount', {
    form: {
      name: 'API Test User',
      email,
      password: 'Passw0rd!123',
      title: 'Mr',
      birth_date: '1',
      birth_month: '1',
      birth_year: '1990',
      firstname: 'API',
      lastname: 'Tester',
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

  expect(response.status()).toBe(200); // transport-level: the request itself succeeded
  const body = await response.json();
  expect(body.responseCode).toBe(201); // application-level: the account was actually created

  // Clean up — see file 05 for why every POST-that-creates should be
  // paired with cleanup, the same idempotency principle from
  // tests/09-Test Data & Environment Management/01-test-data-strategies.spec.ts.
  await request.delete('https://automationexercise.com/api/deleteAccount', {
    form: { email, password: 'Passw0rd!123' },
  });
});

test('PUT — replacing/updating an existing resource', async ({ request }) => {
  const email = uniqueEmail('put');
  const password = 'Passw0rd!123';

  await request.post('https://automationexercise.com/api/createAccount', {
    form: {
      name: 'Before Update',
      email,
      password,
      title: 'Mrs',
      birth_date: '5',
      birth_month: '6',
      birth_year: '1988',
      firstname: 'Before',
      lastname: 'Update',
      company: 'Old Co',
      address1: 'Old Address',
      address2: '',
      country: 'United States',
      zipcode: '10001',
      state: 'NY',
      city: 'New York',
      mobile_number: '5555550100',
    },
  });

  const updateResponse = await request.put('https://automationexercise.com/api/updateAccount', {
    form: {
      name: 'After Update',
      email, // the identifying field — everything else below replaces the old values
      password,
      title: 'Mrs',
      birth_date: '5',
      birth_month: '6',
      birth_year: '1988',
      firstname: 'After',
      lastname: 'Update',
      company: 'New Co',
      address1: 'New Address',
      address2: '',
      country: 'Canada',
      zipcode: '90001',
      state: 'ON',
      city: 'Toronto',
      mobile_number: '4444444444',
    },
  });

  const updateBody = await updateResponse.json();
  expect(updateBody.responseCode).toBe(200);
  expect(updateBody.message).toBe('User updated!');

  // Confirm the update actually took effect with a follow-up GET.
  const detailsResponse = await request.get('https://automationexercise.com/api/getUserDetailByEmail', {
    params: { email },
  });
  const details = await detailsResponse.json();
  expect(details.user.name).toBe('After Update');
  expect(details.user.company).toBe('New Co');
  expect(details.user.country).toBe('Canada');

  await request.delete('https://automationexercise.com/api/deleteAccount', { form: { email, password } });
});

test('DELETE — removing a resource, and confirming it is actually gone', async ({ request }) => {
  const email = uniqueEmail('delete');
  const password = 'Passw0rd!123';

  await request.post('https://automationexercise.com/api/createAccount', {
    form: {
      name: 'To Be Deleted',
      email,
      password,
      title: 'Mr',
      birth_date: '1',
      birth_month: '1',
      birth_year: '1990',
      firstname: 'To',
      lastname: 'Delete',
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

  const deleteResponse = await request.delete('https://automationexercise.com/api/deleteAccount', {
    form: { email, password },
  });
  const deleteBody = await deleteResponse.json();
  expect(deleteBody.responseCode).toBe(200);

  // A DELETE that returns 200 isn't proof enough by itself — confirm the
  // resource is genuinely gone with an independent follow-up check.
  const verifyResponse = await request.post('https://automationexercise.com/api/verifyLogin', {
    form: { email, password },
  });
  const verifyBody = await verifyResponse.json();
  expect(verifyBody.responseCode).toBe(404); // "User not found!" — deletion confirmed
});
