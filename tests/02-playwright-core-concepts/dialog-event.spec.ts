import { test, expect } from '@playwright/test';

test.describe('Handling Browser Dialogs', () => {

    test('Handle alert popup', async ({ page }) => {

        // Listen for the alert
        page.on('dialog', async (dialog) => {

            console.log(dialog.message());

            // Accept the alert
            await dialog.accept();
        });

        await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

        await page.getByRole('button', { name: 'Click for JS Alert' }).click();

        await expect(
            page.locator('#result')
        ).toHaveText('You successfully clicked an alert');
    });


    test('Handle confirm popup', async ({ page }) => {

        page.on('dialog', async (dialog) => {

            console.log(dialog.message());

            // Click Cancel
            await dialog.dismiss();
        });

        await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

        await page.getByRole('button', { name: 'Click for JS Confirm' }).click();

        await expect(
            page.locator('#result')
        ).toHaveText('You clicked: Cancel');
    });


    test('Handle prompt popup', async ({ page }) => {

        page.on('dialog', async (dialog) => {

            console.log(dialog.message());

            // Enter text in the prompt
            await dialog.accept('Dharani');
        });

        await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

        await page.getByRole('button', { name: 'Click for JS Prompt' }).click();

        await expect(
            page.locator('#result')
        ).toHaveText('You entered: Dharani');
    });

});