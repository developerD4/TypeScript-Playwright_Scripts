import { test, expect } from '@playwright/test';

test('Upload a file', async ({ page }) => {

    await page.goto('https://the-internet.herokuapp.com/upload');

    // Select the file
    await page
        .locator('#file-upload')
        .setInputFiles('test-data/sample.txt');

    // Click Upload
    await page
        .getByRole('button', { name: 'Upload' })
        .click();

    // Verify uploaded file
    await expect(
        page.locator('#uploaded-files')
    ).toHaveText('sample.txt');
});