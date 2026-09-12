// Definition: This is the important .spec.ts because it consumes user-defined data from JSON/CSV/Excel.
// Important: The test logic remains the same while the input changes for every data row. This is the core data-driven testing concept.
//json
// import { test, expect } from '@playwright/test';
// import fs from 'fs';
// import path from 'path';

// interface LoginData {
//     username: string;
//     password: string;
// }
// const filePath = path.join(__dirname, '../test-data/data/users.json');
// const fileContent = fs.readFileSync(filePath, 'utf-8'); // → reads JSON as STRING
// const users: LoginData[] = JSON.parse(fileContent); //→ converts STRING → JavaScript object/array
// for (const user of users) {
//     test(`Login with ${user.username}`, async ({ page }) => {
//         await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
//         await page.getByPlaceholder('Username').fill(user.username);
//         await page.getByPlaceholder('Password').fill(user.password);
//         await page.getByRole('button', { name: 'Login' }).click();
//         // Just demonstrate that the test executed.
//         console.log(`Executed login test for ${user.username}`);
//     });
// }
//other option:
//1. import usersJson from '../test-data/data/users.json';
//2. const users: LoginData[] = usersJson;
//3. resolveJsonModule is enabled in tsconfig.json

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

// csv version  npm install csv-parse
// import { test } from '@playwright/test';
// import fs from 'fs';
// import path from 'path';
// import { parse } from 'csv-parse/sync';
// interface LoginData {
//     username: string;
//     password: string;
// }
// const filePath = path.join(__dirname, '../test-data/data/users.csv');
// const fileContent = fs.readFileSync(filePath, 'utf-8');
// const users = parse(fileContent, { columns: true, skip_empty_lines: true }) as LoginData[];
// // CSV parser returns unknown by default. You must tell TypeScript what type the parsed CSV rows should be
// for (const user of users) {
//     test(`Login with ${user.username}`, async ({ page }) => {
//         await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
//         await page.getByPlaceholder('Username').fill(user.username);
//         await page.getByPlaceholder('Password').fill(user.password);
//         await page.getByRole('button', { name: 'Login' }).click();
//     });
// }

//Excel version - npm install xlsx
import { test } from '@playwright/test';
import * as XLSX from 'xlsx';
import path from 'path';

const filePath = path.join(__dirname, '../test-data/data/users.xlsx');
const workbook = XLSX.readFile(filePath);
const sheet = workbook.Sheets['Users'];
const users = XLSX.utils.sheet_to_json(sheet);
for (const user of users as any[]) { //as any[] → tells TypeScript to treat users as an array of any type
    test(`Login with ${user.username}`, async ({ page }) => {
        await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        await page.getByPlaceholder('Username').fill(user.username);
        await page.getByPlaceholder('Password').fill(user.password);
        await page.getByRole('button', { name: 'Login' }).click();
    });
}