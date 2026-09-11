// import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loginData } from '../test-data/loginData';
import { getFutureDate } from '../utils/dateUtils';
import { generateRandomEmail, generateRandomFirstName } from '../utils/randomDataGenerator';
import { capitalize } from '../utils/stringHelpers';
import { test, expect } from '../fixtures/base-fixtures'
import { createUser } from '../factory/userFactory';
test('OrangeHRM login test', async ({ page, loginPage }) => {
    // Create Login Page object
    // const loginPage = new LoginPage(page);
    // Get username and password from test data
    const username = loginData.username;

    const password = loginData.password;

    // Open OrangeHRM login page
    await loginPage.open();

    // Login to OrangeHRM
    await loginPage.login(username, password);
    await page.waitForTimeout(5000);
    // Verify successful login
    await expect(page).toHaveURL(/dashboard/);
    // Generate random test data
    // const firstName = generateRandomFirstName();
    // console.log('First Name:', firstName);
    // const email = generateRandomEmail(firstName);
    // console.log('Random Email:', email);

    // // Use utility function
    // const name = capitalize(firstName);
    // const futureDate = getFutureDate(7);
    // console.log('Name:', name);
    // console.log('Future Date:', futureDate);
    // //factory
    // const user1 = createUser();
    // console.log(user1);
    // console.log(user1.firstName);
    // console.log(user1.lastName);
    // console.log(user1.email);
    // console.log(user1.username);
    // console.log(user1.password);
});
