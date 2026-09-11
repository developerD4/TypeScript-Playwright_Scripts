# Beginner Playwright Automation Framework

This is a small TypeScript and Playwright framework for learning browser automation. It uses the OrangeHRM demo application and keeps one clear place for each responsibility.

## Run it

```bash
npm install
npx playwright install chromium
npm test
npm run test:staging
npm run typecheck
```

`TEST_ENV` selects `.env.qa`, `.env.staging`, `.env.dev`, or `.env.production`. QA is the default. Do not put real secrets in committed `.env` files; the supplied credentials are public demo credentials.

## Folder structure

```text
framework/
  config/       reads the selected .env file
  fixtures/     shares Page Objects with tests
  pages/        Page Object Model classes and locators
  test-data/    stable test values and expected results
  utils/        small date, random-data, and string helpers
tests/          readable test scenarios
.env.*          environment-specific values
playwright.config.ts  Playwright settings
```

## Core concepts

### Framework structure and responsibilities
What it is: A set of folders that gives each kind of code one home.
Why we use it: It keeps tests short and makes files easy to find.
Example: A login scenario is in `tests/`, while its page actions are in `framework/pages/`.

### Tests
What it is: A test is a small scenario that checks expected application behaviour.
Why we use it: It tells us quickly whether an important user flow still works.
Example: `tests/login.spec.ts` checks that a user reaches the Dashboard.

### Page Object Model (POM)
What it is: A Page Object is a class containing one page's locators and actions.
Why we use it: It prevents tests from repeating selectors and click steps.
Example: `LoginPage.login()` fills both fields and clicks Login.

### Reusable utility functions
What it is: Utilities are small functions used by more than one test.
Why we use it: We write common logic once instead of copying it.
Example: `normalizeWhitespace()` cleans text before an assertion.

### Date utilities
What it is: Date utilities create and format dates consistently.
Why we use it: Date fields need predictable text such as `2026-01-12`.
Example: `addDays()` creates a joining date seven days ahead.

### Random test-data generation
What it is: Random generators create unique values for each test run.
Why we use it: Unique email addresses avoid duplicate-data failures.
Example: `generateRandomEmail('Asha')` returns a new email address.

### String utilities
What it is: String utilities change or clean text values.
Why we use it: Application text can contain extra spaces or different casing.
Example: `capitalize('asha')` returns `Asha`.

### Test data management
What it is: Test data files store stable values outside a test scenario.
Why we use it: Expected values can be reused and changed in one place.
Example: `loginData.expectedDashboardHeading` is used by the login test.

### Fixtures and common setup
What it is: A fixture provides a ready-to-use object to a test.
Why we use it: Tests do not need to create the same Page Object repeatedly.
Example: `base-fixtures.ts` supplies `loginPage` to `login.spec.ts`.

### Environment configuration
What it is: Configuration is one typed object holding the active environment values.
Why we use it: Tests can switch targets without changing test code.
Example: `config.baseURL` is read by Playwright and the Page Object.

### .env files and QA/Staging handling
What it is: `.env` files hold values that differ by environment, such as URLs.
Why we use it: QA and Staging can use different settings with the same tests.
Example: `npm run test:staging` loads `.env.staging`.

### Playwright configuration
What it is: `playwright.config.ts` defines test location, browser, reports, and base URL.
Why we use it: Every test run follows the same rules.
Example: This project runs the Chromium project by default.

### Basic TypeScript imports and exports
What it is: `export` shares code from a file and `import` uses it elsewhere.
Why we use it: It connects small focused files without copying code.
Example: `login.spec.ts` imports `config` and `loginData`.

### Reusability and separation of responsibilities
What it is: Each file does one clear job and exposes only what other files need.
Why we use it: A change to a locator or utility happens in one safe place.
Example: A selector change belongs in `LoginPage.ts`, not every test.
