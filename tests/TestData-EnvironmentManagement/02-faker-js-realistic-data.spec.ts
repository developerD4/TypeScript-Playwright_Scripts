import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Faker.js Test Data', () => {

  test('Generate realistic user data', async () => {

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const phone = faker.phone.number();

    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Phone:', phone);

    expect(firstName).not.toBe('');
    expect(email).toContain('@');
    expect(phone).not.toBe('');
  });


  test('Generate complete user object', async () => {

    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      city: faker.location.city(),
      address: faker.location.streetAddress()
    };

    console.log(user);

    expect(user.firstName).not.toBe('');
    expect(user.email).toContain('@');
    expect(user.city).not.toBe('');
  });


  test('Use Faker data in a form', async ({ page }) => {

    const name = faker.person.fullName();
    const email = faker.internet.email();

    await page.goto('https://automationexercise.com/login');

    await page
      .locator('[data-qa="signup-name"]')
      .fill(name);

    await page
      .locator('[data-qa="signup-email"]')
      .fill(email);

    await page
      .locator('[data-qa="signup-button"]')
      .click();

    await expect(page).toHaveURL(/signup/);
  });


  test('Use seed when debugging', async () => {

    faker.seed(100);

    const firstName1 = faker.person.firstName();

    faker.seed(100);

    const firstName2 = faker.person.firstName();

    expect(firstName1).toBe(firstName2);
  });

});