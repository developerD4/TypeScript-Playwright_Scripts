import { test, expect } from '@playwright/test';
import { createAccount, deleteAccount } from '../12-API Testing with Playwright/helpers/accountApi';

/*
 * HTTP methods:
 * GET    = read data
 * POST   = create data
 * PUT    = update data
 * DELETE = remove data
 */

// Creates a unique email for every test run.
function uniqueEmail(): string {
  return `qa.${Date.now()}@example.com`;
}


// GET - Read data
test('GET - read products', async ({ request }) => {

  // GET retrieves data from the API.
  const response = await request.get(
    'https://automationexercise.com/api/productsList'
  );

  expect(response.status()).toBe(200);

  // json() converts the JSON response into a JavaScript object.
  const body = await response.json();

  expect(Array.isArray(body.products)).toBe(true);
});


// POST - Create data
test('POST - create account', async ({ request }) => {

  const email = uniqueEmail();
  const password = 'Passw0rd!123';

  // Helper creates the account using POST.
  const body = await createAccount(request, {
    name: 'API Test User',
    email,
    password
  });

  // API confirms account creation.
  expect(body.responseCode).toBe(201);

  // Cleanup: delete the test account.
  await deleteAccount(request, email, password);
});


// PUT - Update data
test('PUT - update account', async ({ request }) => {

  const email = uniqueEmail();
  const password = 'Passw0rd!123';

  // Setup: create an account first.
  await createAccount(request, {
    name: 'Before Update',
    email,
    password
  });

  // PUT updates existing data.
  const response = await request.put(
    'https://automationexercise.com/api/updateAccount',
    {
      form: {
        name: 'After Update',
        email,
        password,
        title: 'Mr',
        birth_date: '1',
        birth_month: '1',
        birth_year: '1990',
        firstname: 'After',
        lastname: 'Update',
        company: 'New Company',
        address1: 'New Address',
        address2: '',
        country: 'Canada',
        zipcode: '90001',
        state: 'ON',
        city: 'Toronto',
        mobile_number: '4444444444'
      }
    }
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(200);

  // Cleanup.
  await deleteAccount(request, email, password);
});


// DELETE - Remove data
test('DELETE - remove account', async ({ request }) => {

  const email = uniqueEmail();
  const password = 'Passw0rd!123';

  // Setup: create an account first.
  await createAccount(request, {
    name: 'Delete User',
    email,
    password
  });

  // DELETE removes the account.
  const response = await request.delete(
    'https://automationexercise.com/api/deleteAccount',
    {
      form: {
        email,
        password
      }
    }
  );

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.responseCode).toBe(200);
});



// json() converts a JSON response into a JavaScript object.
// const jsonData = '{"id":101,"name":"John"}';
// const jsonresult = JSON.parse(jsonData)
// const user = { id: 101, 1: "John" };
// console.log(jsonresult.id)
// console.log(user.id)
// | Status  | Name                  | Simple meaning                              |
// | ------- | --------------------- | ------------------------------------------- |
// | **200** | OK                    | Request was successful                      |
// | **201** | Created               | New resource was created                    |
// | **204** | No Content            | Request succeeded, but no response body     |
// | **400** | Bad Request           | Request/data is invalid                     |
// | **401** | Unauthorized          | Authentication is missing/invalid           |
// | **403** | Forbidden             | Authenticated, but not allowed              |
// | **404** | Not Found             | Resource/API endpoint not found             |
// | **405** | Method Not Allowed    | HTTP method isn't allowed for that endpoint |
// | **409** | Conflict              | Request conflicts with existing data        |
// | **422** | Unprocessable Content | Data format/validation is unacceptable      |
// | **500** | Internal Server Error | Server-side error                           |
// | **502** | Bad Gateway           | Gateway/proxy received a bad response       |
// | **503** | Service Unavailable   | Server/service temporarily unavailable      |
