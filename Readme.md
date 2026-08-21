# How to Run a Specific Test — Simple Guide

Your project structure looks like this:

```
project
 └── src
      └── tests
           ├── simpletest
           │     └── simple.js
           ├── anotherfolder
           │     └── another.js
           └── ... (more folders)
```

Below are simple commands to run only the test(s) you want, instead of running everything.

---

## 1. Run only ONE test file

If you want to run just `simple.js`, type this in your terminal:

```bash
npx playwright test src/tests/simpletest/simple.js
```

**What this means:** You are telling Playwright, "Only run this one file, ignore all the other test files."

---

## 2. Run ALL tests inside ONE folder

If you want to run every test file inside the `simpletest` folder only:

```bash
npx playwright test src/tests/simpletest
```

**What this means:** Playwright will run every `.js` test file found inside that folder.

---

## 3. Run a test file by typing just part of its name

You don't always need to type the full path. You can just type part of the file name:

```bash
npx playwright test simple
```

**What this means:** Playwright will search all folders and run any file whose name/path contains the word "simple".

---

## 4. Run ONE specific test inside a file (by its test name)

Sometimes a file has many small tests inside it, like:

```javascript
test('should login successfully', async () => { ... });
test('should show error on wrong password', async () => { ... });
```

If you only want to run the "should login successfully" test, use `-g` (this means "search for this text"):

```bash
npx playwright test src/tests/simpletest/simple.js -g "should login successfully"
```

**What this means:** Run only the test whose name matches the text you typed.

---

## 5. Run MULTIPLE specific files together

If you want to run two or more chosen files (not all of them):

```bash
npx playwright test src/tests/simpletest/simple.js src/tests/anotherfolder/another.js
```

**What this means:** Just add more file paths, one after another, separated by a space.

---

## 6. Run a test and SEE the browser open

Normally tests run in the background (you don't see anything). If you want to actually watch the browser while the test runs:

```bash
npx playwright test src/tests/simpletest/simple.js --headed
```

You can also choose which browser to use:

```bash
npx playwright test src/tests/simpletest/simple.js --headed --project=chromium
```

---

## 7. Run a test in DEBUG mode (step-by-step)

This is useful when a test is failing and you want to slowly go through it step by step:

```bash
npx playwright test src/tests/simpletest/simple.js --debug
```

---

## Important Things to Check in Your Project

### ✅ Check 1: `testDir` setting
Open your `playwright.config.js` file. Make sure it points to your tests folder like this:

```javascript
export default {
  testDir: './src/tests',
};
```

This tells Playwright: "All my tests are inside the `src/tests` folder."

### ✅ Check 2: File naming pattern
By default, Playwright looks for files named like:
- `something.spec.js`
- `something.test.js`

But your files are named simply like `simple.js` (no `.spec` or `.test` in the name).

So you may need to add this to your `playwright.config.js` so Playwright knows to pick up plain `.js` files too:

```javascript
export default {
  testDir: './src/tests',
  testMatch: '**/*.js',
};
```

**What this means:** "Look inside every folder and every sub-folder, and treat every `.js` file as a test file."

---

## Quick Summary Table

| What you want to do | Command to use |
|---|---|
| Run one file | `npx playwright test path/to/file.js` |
| Run one folder | `npx playwright test path/to/folder` |
| Run by partial name | `npx playwright test partname` |
| Run one test by name | `npx playwright test path/to/file.js -g "test name"` |
| Run multiple files | `npx playwright test file1.js file2.js` |
| Run and watch browser | `npx playwright test path/to/file.js --headed` |
| Run step-by-step (debug) | `npx playwright test path/to/file.js --debug` |
