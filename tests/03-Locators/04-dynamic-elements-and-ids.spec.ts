import { test, expect } from '@playwright/test';

test.describe('Dynamic Elements', () => {
  test('Handle delayed content', async ({ page }) => {
    await page.goto('https://playwrightlab.github.io/');
    // Select a delay
    await page.getByRole('button', { name: 'Load Content' }).click();
    // Wait for 3 seconds
    await page.waitForTimeout(3000);
    // Verify the content
    await expect(
      page.getByText('Content Loaded Successfully!')
    ).toBeVisible({ timeout: 10000 });
  });
  test('Handle show and hide element', async ({ page }) => {
    await page.goto('https://playwrightlab.github.io/');
    // Show the element
    await page.getByRole('button', { name: 'Show Element' }).click();
    // Wait for the UI to change
    await page.waitForTimeout(1000);
    await expect(
      page.getByText("I'm visible!")
    ).toBeVisible({ timeout: 10000 });
    // Hide the element
    await page.getByRole('button', { name: 'Hide Element' }).click();
    await page.waitForTimeout(1000);
    await expect(
      page.getByText("I'm visible!")
    ).not.toBeVisible({ timeout: 10000 });
  });

  test('Handle disabled and enabled input', async ({ page }) => {

    await page.goto('https://playwrightlab.github.io/');

    const input = page.getByPlaceholder('Type here...');

    // Disable the input
    await page.getByRole('button', { name: 'Disable Input' }).click();

    await page.waitForTimeout(500);

    await expect(input).toBeDisabled({ timeout: 10000 });

    // Enable the input
    await page.getByRole('button', { name: 'Enable Input' }).click();

    await page.waitForTimeout(500);

    await expect(input).toBeEnabled({ timeout: 10000 });

    await input.fill('Hello Playwright');

    await expect(input).toHaveValue('Hello Playwright', {
      timeout: 10000
    });
  });

});

// ID starts with "input-" → page.locator('[id^="input-"]'); — Finds elements whose ID starts with input-.
// ID ends with "-input" → page.locator('[id$="-input"]'); — Finds elements whose ID ends with -input.
// ID contains "input" → page.locator('[id*="input"]'); — Finds elements whose ID contains input anywhere.