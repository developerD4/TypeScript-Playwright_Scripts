import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

interface LoginData {
    username: string;
    password: string;
}


const filePath = path.join(
    __dirname,
    '../test-data/users.json'
);


const fileContent =
    fs.readFileSync(filePath, 'utf-8');


const users: LoginData[] =
    JSON.parse(fileContent);


for (const user of users) {

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

        // Just demonstrate that the test executed.
        console.log(
            `Executed login test for ${user.username}`
        );

    });
}


// users.json
//      ↓
// readFileSync()
//      ↓
// JSON.parse()
//      ↓
// users[]
//      ↓
// for...of
//      ↓
// test()
//      ↓
// same test logic + different data