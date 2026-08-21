// 05-chaining-api-calls-for-test-data-setup.spec.ts
//
// TOPIC: chaining API calls to set up test data instead of doing it via the UI
//
// Site used: https://automationexercise.com/api (see sites.txt #4)
// Helper code reused here: ./helpers/accountApi.ts
//
// Creating an account through the UI means: navigate, fill ~15 form
// fields across two pages, submit, wait for each page transition — many
// seconds, and many things that can flake (a slow page load, a locator
// that shifted). Creating the SAME account via a chain of API calls
// takes a few hundred milliseconds and has far fewer places to fail,
// because it skips the UI's rendering/JS entirely and talks to the
// backend directly. Reserve the UI for what a test is actually ABOUT —
// use API chaining for everything that's just precondition setup.

import { test, expect } from '@playwright/test';
import { createAccount, deleteAccount } from './helpers/accountApi';

test('chain: create an account, then immediately use it as a precondition', async ({
  request,
}) => {
  const email = `qa.chain.${Date.now()}@example.com`;
  const password = 'Passw0rd!123';

  // Step 1: set up the data this test needs — not what the test is
  // actually testing.
  const created = await createAccount(request, { name: 'Chain Test User', email, password });
  expect(created.responseCode).toBe(201);

  // Step 2: THIS is what the test is actually about — using the account
  // that step 1 set up, without the test needing to know or care how that
  // account came to exist.
  const verifyResponse = await request.post('https://automationexercise.com/api/verifyLogin', {
    form: { email, password },
  });
  const verifyBody = await verifyResponse.json();
  expect(verifyBody.responseCode).toBe(200);
  expect(verifyBody.message).toBe('User exists!');

  // Step 3: clean up — pairs with step 1's creation, same idempotency
  // principle as tests/09-Test Data & Environment Management/04-database-seeding-and-cleanup.spec.ts.
  await deleteAccount(request, email, password);
});

test('chain: create -> read -> update -> read again, all via API', async ({ request }) => {
  const email = `qa.chain2.${Date.now()}@example.com`;
  const password = 'Passw0rd!123';

  await createAccount(request, { name: 'Original Name', email, password });

  // Read back what was just created, to confirm the chain's first link
  // actually took effect before building on top of it.
  const beforeUpdate = await request.get('https://automationexercise.com/api/getUserDetailByEmail', {
    params: { email },
  });
  const beforeBody = await beforeUpdate.json();
  expect(beforeBody.user.name).toBe('Original Name');

  // Each step below feeds off data confirmed by the PREVIOUS step — this
  // is the "chaining" itself: not just several unrelated API calls in one
  // test, but each one depending on the last one's confirmed result.
  await request.put('https://automationexercise.com/api/updateAccount', {
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
  });

  const afterUpdate = await request.get('https://automationexercise.com/api/getUserDetailByEmail', {
    params: { email },
  });
  const afterBody = await afterUpdate.json();
  expect(afterBody.user.name).toBe('Updated Name');

  await deleteAccount(request, email, password);
});

test('the helper module hides the chain\'s setup noise from the test that just needs an account', async ({
  request,
}) => {
  const email = `qa.chain3.${Date.now()}@example.com`;
  const password = 'Passw0rd!123';

  // Compare this ONE line to the 15-field form object repeated in the
  // earlier tests in this file (and in file 02) — helpers/accountApi.ts
  // is exactly the DRY principle from
  // tests/08-Automation Framework Best Practices/03-dry-principle.spec.ts
  // applied to API test-data setup specifically.
  const created = await createAccount(request, { name: 'Helper User', email, password });
  expect(created.responseCode).toBe(201);

  await deleteAccount(request, email, password);
});
