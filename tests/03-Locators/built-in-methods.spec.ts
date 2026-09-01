import { test, expect } from '@playwright/test';

test('Practice Playwright built-in locators', async ({ page }) => {
    // Open the application
    await page.goto('https://playwrightlab.github.io');

    // 1. getByRole()
    // Find an element using its accessibility role and name
    const button = page.getByRole('button', { name: 'Submit' });
    await expect(button).toBeVisible();

    // 2. getByText()
    // Find an element using visible text
    const heading = page.getByText('Playwright');
    await expect(heading).toBeVisible();

    // 3. getByLabel()
    // Find a form field using its associated label
    const username = page.getByLabel('Username');
    await expect(username).toBeVisible();
    await username.fill('testuser');

    // 4. getByPlaceholder()
    // Find an input using its placeholder text
    const email = page.getByPlaceholder('Enter your email');
    await expect(email).toBeVisible();
    await email.fill('test@example.com');

    // 5. getByAltText()
    // Find an image using its alt text
    const logo = page.getByAltText('Playwright logo');
    await expect(logo).toBeVisible();

    // 6. getByTitle()
    // Find an element using its title attribute
    const help = page.getByTitle('Help');
    await expect(help).toBeVisible();

    // 7. getByTestId()
    // Find an element using data-testid
    const message = page.getByTestId('success-message');
    await expect(message).toBeVisible();
});