import { test as base, expect, Page } from '@playwright/test';

/*
  CUSTOM FIXTURE

  A fixture is a reusable setup.

  Example:
  Instead of writing login steps in every test,
  we create a fixture called "loggedInPage".

  The fixture will:
  1. Open the login page
  2. Enter username
  3. Enter password
  4. Click Login
  5. Give the logged-in page to the test
  6. Logout after the test
*/

// --------------------------------------------------
// STEP 1: Define the type of our custom fixture
// --------------------------------------------------

type MyFixtures = {
  loggedInPage: Page;
};


// --------------------------------------------------
// STEP 2: Create the custom fixture
// --------------------------------------------------

const test = base.extend<MyFixtures>({
  loggedInPage: async ({ page }, use) => {

    // ------------------------------------------
    // SETUP
    // Everything before use(page) runs
    // BEFORE the test starts.
    // ------------------------------------------

    await page.goto('https://the-internet.herokuapp.com/login');

    await page.getByLabel('Username').fill('tomsmith');

    await page
      .getByLabel('Password')
      .fill('SuperSecretPassword!');

    await page.getByRole('button', { name: 'Login' }).click();

    // Check that login was successful
    await expect(page.locator('.flash.success')).toBeVisible();


    // ------------------------------------------
    // GIVE THE PAGE TO THE TEST
    // ------------------------------------------

    await use(page);

    // ------------------------------------------
    // TEARDOWN
    // Everything after use(page) runs
    // AFTER the test finishes.
    // ------------------------------------------

    await page.getByRole('link', { name: 'Logout' }).click();
  }
});


// --------------------------------------------------
// STEP 3: Use the custom fixture in a test
// --------------------------------------------------

test.describe('Custom Fixture Example', () => {

  test('user is already logged in', async ({ loggedInPage }) => {

    // We don't need login code here.

    // The fixture has already logged in.

    await expect(
      loggedInPage.locator('h2')
    ).toHaveText('Secure Area');
  });


  test('user can access the secure page', async ({ loggedInPage }) => {

    // Again, loggedInPage is already logged in.

    await expect(loggedInPage).toHaveURL(/secure/);
  });

});