import { test, expect } from '@playwright/test';

test('CSS Selector vs XPath', async ({ page }) => {

    await page.goto('https://www.saucedemo.com');

    // Login using CSS selectors
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();

    await expect(page).toHaveURL(/inventory.html/);


    // CSS Selector
    const backpackCSS = page.locator(
        '[data-test="add-to-cart-sauce-labs-backpack"]'
    );

    await expect(backpackCSS).toBeVisible();


    // XPath
    const backpackXPath = page.locator(
        '//button[@data-test="add-to-cart-sauce-labs-backpack"]'
    );

    await expect(backpackXPath).toBeVisible();


    // Both locators point to the same button
    await backpackCSS.click();

    await expect(
        page.locator('[data-test="remove-sauce-labs-backpack"]')
    ).toBeVisible();
});