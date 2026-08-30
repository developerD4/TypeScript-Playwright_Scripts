import { test, expect } from '@playwright/test';

test('Download a file', async ({ page }) => {

    await page.goto('https://the-internet.herokuapp.com/download');

    // Wait for download and click the file
    const [download] = await Promise.all([
        page.waitForEvent('download'),

        page.getByText('sample.txt').click()
    ]);

    // Get downloaded file name
    const fileName = download.suggestedFilename();

    console.log('Downloaded file:', fileName);

    // Save the downloaded file
    await download.saveAs(`downloads/${fileName}`);

    expect(fileName).toBe('sample.txt');
});