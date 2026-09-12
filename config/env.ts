import { test } from '@playwright/test';
import * as XLSX from 'xlsx';
import path from 'path';


const filePath = path.join(
    __dirname,
    '../test-data/users.xlsx'
);


const workbook =
    XLSX.readFile(filePath);


const sheet =
    workbook.Sheets['Users'];


const users =
    XLSX.utils.sheet_to_json(sheet);


for (const user of users as any[]) {

    test(`Login with ${user.username}`, async ({ page }) => {

        await page.goto(
            'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'
        );

        await page
            .getByPlaceholder('Username')
            .fill(user.username);

        await page
            .getByPlaceholder('Password')
            .fill(user.password);

        await page
            .getByRole('button', { name: 'Login' })
            .click();

    });
}