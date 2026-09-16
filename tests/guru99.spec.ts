import { test, expect } from '@playwright/test';
import { GuruLogin } from '../pages/GuruLogin'

test('Generate credentials, login and create customer', async ({ page }) => {
    // Step 1: Open Guru99
    const guru = new GuruLogin(page);
    await guru.open()
    await guru.login();
    expect(guru.getAccessPage()).toBeVisible();
    const result = await guru.credentialTrim();
    console.log(result.userID?.trim());
    console.log(result.pass?.trim());
});