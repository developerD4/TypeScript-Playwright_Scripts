// 03-json-csv-excel-data-driven-tests.spec.ts
//
// TOPIC: managing test data via JSON, CSV, and Excel data-driven test files
//
// Site used: https://www.saucedemo.com (see sites.txt #3)
// Data fixtures: ./data/users.json, ./data/users.csv, ./data/users.xlsx
//   (all three files contain the SAME three login scenarios, one per
//   format, so this file can show the identical data-driven pattern
//   working against each one)
//
// "Data-driven testing" means one test BODY runs once per row of external
// data, instead of writing a near-identical test by hand for every case.
// Whichever file format the data lives in, the pattern is the same:
//   1. read the file
//   2. parse it into an array of plain objects
//   3. loop over that array, calling test() once per row

import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import { parse as parseCsv } from 'csv-parse/sync';
import ExcelJS from 'exceljs';

interface LoginCase {
  username: string;
  password: string;
  expectSuccess: boolean;
  expectedErrorContains: string;
}

async function runLoginCase(page: Page, testCase: LoginCase) {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill(testCase.username);
  await page.locator('#password').fill(testCase.password);
  await page.locator('#login-button').click();

  if (testCase.expectSuccess) {
    await expect(page).toHaveURL(/inventory\.html/);
  } else {
    await expect(page.locator('[data-test="error"]')).toContainText(testCase.expectedErrorContains);
  }
}

test.describe('data-driven from JSON', () => {
  // JSON needs no library and no type conversion — booleans/numbers in the
  // file are already the right JS type after JSON.parse(). Best fit when
  // you're hand-authoring the data yourself, or generating it from code.
  const jsonPath = path.join(__dirname, 'data', 'users.json');
  const jsonCases: LoginCase[] = JSON.parse(readFileSync(jsonPath, 'utf-8'));

  for (const testCase of jsonCases) {
    test(`[JSON] "${testCase.username}" / "${testCase.password}"`, async ({ page }) => {
      await runLoginCase(page, testCase);
    });
  }
});

test.describe('data-driven from CSV', () => {
  // CSV is the format non-developers (manual QA, business analysts) can
  // most easily edit in Excel/Google Sheets and hand off as a plain text
  // file. Every CSV VALUE parses as a string, so anything that isn't
  // already text (like our boolean expectSuccess column) needs an
  // explicit conversion — that's the trade-off against JSON.
  const csvPath = path.join(__dirname, 'data', 'users.csv');
  const csvRaw = readFileSync(csvPath, 'utf-8');
  const csvRows: Record<string, string>[] = parseCsv(csvRaw, {
    columns: true, // use row 1 as property names instead of numeric indexes
    skip_empty_lines: true,
  });

  const csvCases: LoginCase[] = csvRows.map((row) => ({
    username: row.username,
    password: row.password,
    expectSuccess: row.expectSuccess === 'true', // string -> boolean
    expectedErrorContains: row.expectedErrorContains,
  }));

  for (const testCase of csvCases) {
    test(`[CSV] "${testCase.username}" / "${testCase.password}"`, async ({ page }) => {
      await runLoginCase(page, testCase);
    });
  }
});

test.describe('data-driven from Excel (.xlsx)', () => {
  // Excel is common when test data is maintained by a QA/business team
  // already working in spreadsheets day to day, especially with multiple
  // sheets or data that benefits from spreadsheet formulas/formatting.
  // Reading it needs a library (exceljs here) since .xlsx is a binary
  // zip-based format, not plain text like JSON/CSV.
  test('reads users.xlsx and runs one test per row', async () => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path.join(__dirname, 'data', 'users.xlsx'));

    const sheet = workbook.getWorksheet('Users');
    if (!sheet) throw new Error('Expected a "Users" worksheet in users.xlsx');

    const headers: string[] = [];
    const excelCases: LoginCase[] = [];

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell, colNumber) => {
          headers[colNumber] = String(cell.value);
        });
        return;
      }
      const record: Record<string, unknown> = {};
      row.eachCell((cell, colNumber) => {
        record[headers[colNumber]] = cell.value;
      });
      excelCases.push(record as unknown as LoginCase);
    });

    expect(excelCases).toHaveLength(3);
    expect(excelCases[0]).toMatchObject({ username: 'standard_user', expectSuccess: true });
  });

  // NOTE: unlike the JSON/CSV describe blocks above, this doesn't loop
  // `test()` calls at the top level, because reading an .xlsx file is
  // itself async (ExcelJS's readFile returns a Promise) and Playwright
  // needs every test() call registered synchronously, before any test
  // runs. The usual fix is a small one-time async step in
  // `globalSetup` (see framework/global-setup.ts from topic 06) that
  // converts the .xlsx into a plain array/JSON file BEFORE the test
  // files load — then loop over that already-parsed array exactly like
  // the JSON describe block above does.
});
