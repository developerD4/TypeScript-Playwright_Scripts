import { loginData } from '../test-data/loginData';
// import { test, expect } from '@playwright/test'
import { test, expect } from '../fixtures/base-fixtures'
import { PimPage } from '../pages/PIM';
// import { LoginPage } from '../pages/LoginPage';
test.describe("Orange HRM demo automation testing", () => {
    test.beforeEach(async ({ loginPage }) => {
        // Custom fixter
        const username = loginData.username;
        const password = loginData.password;
        // Open OrangeHRM login page
        await loginPage.open();
        // Login to OrangeHRM
        await loginPage.login(username, password);
        //dashboard displayed
    })
    test('Pim open', async ({ page }) => {
        //PIM
        const pim = new PimPage(page);
        await pim.pimMenu();
        await expect(pim.getPimMenu()).toHaveCount(1);
        // click pim
        await expect(page).toHaveURL(/pim/);
        await expect(pim.getPimMenu()).toBeVisible()
    });
    test('Find employee section and open it', async ({ page }) => {
        // Find PIM menu
        const pim = new PimPage(page);
        await pim.pimMenu();
        const getemp = pim.getempInfo();
        // Verify Employee Information section
        await expect(getemp).toBeVisible();
        const menuItem = pim.getPimMenu();
        await expect(menuItem).toHaveText('PIM');
        await expect(menuItem).toBeEnabled();
        await expect(menuItem).toHaveCount(1);
    })
})

// import { test, expect } from '@playwright/test';
 
// test.beforeEach(async ({ page }) => {
//   // Navigate to OrangeHRM Login Page
//   await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
 
//   // Login
//   await page.locator('input[placeholder="Username"]').fill('Admin');
//   await page.locator('input[placeholder="Password"]').fill('admin123');
//   await page.getByRole('button', { name: 'Login' }).click();
 
//   // Verify successful login
//   await expect(page).toHaveURL(/dashboard/);
// });
 
// test('Open Admin Module', async ({ page }) => {
//   const adminMenu = page.getByRole('link', { name: 'Admin' });
//   await expect(adminMenu).toBeVisible();
//   await adminMenu.click();
//   await expect(page).toHaveURL(/admin/);
// });
 
// test('Click Add User Button', async ({ page }) => {
//   await page.getByRole('link', { name: 'Admin' }).click();
//   await expect(page).toHaveURL(/admin/);
//   const addButton = page.getByRole('button', { name: 'Add' });
//   await expect(addButton).toBeVisible();
//   await addButton.click();
//   // Verify Add User form is displayed
//   await expect(page.getByText('Add User')).toBeVisible();
// });
 
// test('Add System User', async ({ page }) => {
//   // Open Admin Module
//   await page.getByRole('link', { name: 'Admin' }).click();
//   // Click Add Button
//   await page.getByRole('button', { name: 'Add' }).click();
//   // User Role
//   await page.locator('.oxd-select-wrapper').first().click();
//   await page.getByRole('option', { name: 'ESS' }).click();
//   // Employee Name
//   await page.locator('input[placeholder="Type for hints..."]').fill('Paul');
//   await expect(page.locator('.oxd-autocomplete-option')).toBeVisible();
//   await page.locator('.oxd-autocomplete-option').first().click();
//   // Status
//   await page.locator('.oxd-select-wrapper').nth(1).click();
//   await page.getByRole('option', { name: 'Enabled' }).click();
//   // Username
//   await page
//     .locator('div:nth-child(4) input.oxd-input').fill(`TestUser${Date.now()}`);
//   // Password
//   await page.locator('input[type="password"]').first().fill('Password@123');
//   // Confirm Password
//   await page.locator('input[type="password"]').nth(1).fill('Password@123');
//   //Save
//   await page.getByRole('button', { name: 'Save' }).click();
//   // Verify redirection to User Management page
// await page.getByRole('link', { name: 'Admin' }).click();
//   await page.locator('input[placeholder="Username"]').fill('Admin');
//   await page.getByRole('button', { name: 'Search' }).click();
//   await expect(page.locator('.oxd-table')).toBeVisible();
// });
 