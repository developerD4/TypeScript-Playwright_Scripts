# Framework Development & Reusable Utilities: 3-day plan

Application used throughout: OrangeHRM demo. The framework examples use one login flow so trainees can see how files connect instead of learning unrelated code samples.

## Schedule

| Day | Topics | Time | Split |
| --- | --- | ---: | --- |
| 1 | Structure, utilities, environment configuration | 7 hours | 2 h explanation, 1 h demo, 4 h hands-on |
| 2 | Logger, action wrappers, data factory, global setup/teardown | 7 hours | 2 h explanation, 1 h demo, 4 h hands-on |
| 3 | Fixtures, integration, final change request | 7 hours | 2 h explanation, 1 h demo, 4 h hands-on |

## Day 1

### 1. Folder structure

- **Priority:** Must Code
- **Time:** 1 hour
- **Problem:** Tests become hard to maintain when every file contains its own URL, generated data, and repeated login steps.
- **Concept:** Keep test scenarios in `tests/` and shared code in `framework/`.
- **Code to use:** `01-folder-structure-overview.md`.
- **Important breakdown:** `config` reads environment values; `utils` contains small reusable functions; `factories` creates complete data; `pages` contains application actions; `fixtures` shares Page Objects.
- **Connection:** A test imports a fixture; the fixture returns a Page Object; the Page Object uses config and common actions.
- **Exercise:** Create a `framework/pages/` folder and add an empty `EmployeePage.ts` with a constructor that accepts `Page`.
- **Outcome:** Trainees can place a new test or shared file in the correct location.
- **Skip:** Enterprise layers, dependency injection, and a folder for every possible design pattern.
- **Trainer guidance:** Say, “Put it near the code that owns the responsibility,” not “memorize architecture rules.”

### 2. Utility functions

- **Priority:** Must Code
- **Time:** 2 hours
- **Problem:** Tests repeatedly need dates, unique employee data, and cleaned application text.
- **Why:** One helper prevents duplicate and inconsistent logic in many tests.
- **Code to use:** `framework/utils/dateUtils.ts`, `randomDataGenerator.ts`, and `stringHelpers.ts`; see lessons 02 and 03.

```ts
export function generateRandomEmail(firstName: string, domain = 'example.com'): string {
  return `${firstName.toLowerCase()}_${generateUniqueId()}@${domain}`;
}
```

- **Breakdown:** `firstName` is input; `domain` has a default; `generateUniqueId()` avoids duplicate email addresses; `string` tells TypeScript what comes back.
- **Connection:** Test creates an email, then passes that returned value to `locator.fill(email)` when a form needs it.
- **Exercise:** Add `generateEmployeeId(prefix: string): string` and test that it starts with the supplied prefix.
- **Outcome:** Trainees can create, export, import, and use a meaningful helper.
- **Skip:** Generic utility frameworks, complex random algorithms, and large third-party utility libraries.
- **Trainer guidance:** Draw `test -> helper -> returned value -> fill/assert` before coding.

### 3. Environment configuration

- **Priority:** Must Code
- **Time:** 4 hours
- **Problem:** A test must run in Dev, QA, or Staging without changing URLs and credentials inside the test.
- **Why:** Environment values change; test behaviour should not.
- **Code to use:** `.env.dev`, `.env.qa`, `.env.staging`, and `framework/config/env.ts`; see lesson 04.

```ts
dotenv.config({ path: `.env.${environment}` });

export const config = {
  env: environment,
  baseURL: requireEnv('BASE_URL'),
  username: requireEnv('TEST_USERNAME'),
  password: requireEnv('TEST_PASSWORD'),
};
```

- **Breakdown:** `TEST_ENV` selects the file; `dotenv` reads values from it; `config` is the single object tests import; `requireEnv` gives a clear error when a required value is missing.
- **Connection:** `.env.qa -> dotenv -> config -> LoginPage/test -> OrangeHRM`.
- **Exercise:** Run lesson 04 with `npm run test:dev` and `npm run test:qa`; add a non-secret `RUN_LABEL` value to both environment files and expose it from `config`.
- **Outcome:** Trainees can add an environment value and use it without hard-coding it in a spec.
- **Skip:** Secret vaults, CI/CD injection, production-write strategies, and environment inheritance design.
- **Trainer guidance:** Emphasize that passwords do not belong in test files; use safe sample credentials only for training.

## Day 2

### 4. Custom logger

- **Priority:** Code Once + Understand
- **Time:** 1.25 hours
- **Problem:** Plain `console.log` messages become inconsistent and difficult to scan in a failed CI run.
- **Why:** One logger gives every important framework message a time and level.
- **Code to use:** `framework/logger/logger.ts`; see lesson 05.

```ts
info(message: string): void {
  this.write('INFO', message);
}

private write(level: string, message: string): void {
  console.log(`[${new Date().toLocaleTimeString()}] [${level}] ${message}`);
}
```

- **Breakdown:** `info`, `warn`, and `error` are clear public methods; all call one private `write` method; the timestamp identifies when the event happened.
- **Connection:** `LoginPage` and `CommonActions` call `logger.info()` before important actions.
- **Exercise:** Add one `logger.info()` before an OrangeHRM page navigation and one `logger.error()` in a catch block.
- **Outcome:** Trainees can add useful logs without logging every low-level action.
- **Skip:** Winston/Pino, log files, dashboards, transport configuration, and distributed tracing.
- **Trainer guidance:** Good log: “Creating employee Ravi.” Bad log: “Clicked button.”

### 5. Wrapper methods around Playwright actions

- **Priority:** Code Once + Understand
- **Time:** 1.75 hours
- **Problem:** Important actions need the same log messages and clearer errors in many Page Objects.
- **Why:** A wrapper centralizes common handling while leaving Playwright's auto-waiting in place.
- **Code to use:** `framework/core/safeActions.ts`; see lesson 06.

```ts
async clickElement(locator: Locator, elementName: string): Promise<void> {
  try {
    logger.info(`Clicking ${elementName}`);
    await locator.click();
    logger.info(`${elementName} clicked`);
  } catch (error) {
    logger.error(`Could not click ${elementName}`);
    throw error;
  }
}
```

- **Breakdown:** `locator` is the target element; `elementName` makes the log understandable; `try/catch` logs failure; `throw error` keeps the test correctly failed.
- **Connection:** `LoginPage.login()` calls `fillText()` and `clickElement()` instead of repeating logging code.
- **Exercise:** Add `selectOption(locator, value, elementName)` using the same pattern.
- **Outcome:** Trainees can add one useful common action without creating retry logic.
- **Skip:** Custom retry engines, backoff algorithms, replacing Playwright waiting, and generic abstraction layers.
- **Trainer guidance:** State clearly: “The wrapper improves messages; it does not fix flaky tests.”

### 6. Test data factory

- **Priority:** Must Code
- **Time:** 1.5 hours
- **Problem:** Tests with hand-written user objects become inconsistent when required fields change.
- **Why:** A factory gives every test valid defaults and allows only needed values to change.
- **Code to use:** `framework/factories/userFactory.ts`; see lesson 07.

```ts
export function createUser(overrides: Partial<User> = {}): User {
  const firstName = generateRandomFirstName();
  return {
    firstName,
    lastName: 'Test',
    username: generateRandomUsername(firstName),
    email: generateRandomEmail(firstName),
    password: 'Password123!',
    ...overrides,
  };
}
```

- **Breakdown:** `User` lists required fields; default values create a valid user; `...overrides` replaces only fields supplied by the test.
- **Connection:** A future `EmployeePage.createEmployee(user)` can consume the returned object directly.
- **Exercise:** Add `jobTitle: string` to `User`, give it a default, and override it in one test.
- **Outcome:** Trainees can modify a factory safely and use overrides.
- **Skip:** Builder chains, factory inheritance, database seed factories, and large object-model hierarchies.
- **Trainer guidance:** Compare one factory call with copying a five-field object into ten tests.

### 7. Global setup and teardown

- **Priority:** Must Understand + Code a Realistic Example
- **Time:** 2.5 hours
- **Problem:** Some checks should run once for the whole suite, not once per test.
- **Why:** It avoids spending test time on a suite when the target application is unavailable.
- **Code to use:** `framework/global-setup.ts`, `framework/global-teardown.ts`, and `playwright.config.ts`; see lesson 08.

```ts
const apiContext = await request.newContext();
const response = await apiContext.get(config.baseURL, {
  timeout: config.apiTimeoutMs,
});
await apiContext.dispose();

if (!response.ok()) {
  throw new Error(`Application is not available. Status: ${response.status()}`);
}
```

- **Breakdown:** Creates a temporary request context; checks the configured URL once; disposes the context; stops the suite early when the application is unavailable.
- **Connection:** `playwright.config.ts` points to setup/teardown; all tests start only after setup succeeds.
- **Exercise:** Change the log message to include `config.env`; run one lesson and observe setup before tests and teardown after tests.
- **Outcome:** Trainees can identify whether common work belongs in `beforeEach`, `beforeAll`, global setup, or global teardown.
- **Skip:** Saved authentication state, worker-scoped state, shared database architecture, and complex cleanup dependencies.
- **Trainer guidance:** Use this comparison: `beforeEach = every test`, `beforeAll = this file`, `globalSetup = whole run`.

## Day 3

### 8. Extending Playwright's base test with fixtures

- **Priority:** Must Code
- **Time:** 3 hours
- **Problem:** Tests repeatedly create the same Page Object.
- **Why:** A fixture prepares the Page Object once in the shared base test and makes it available where needed.
- **Code to use:** `framework/fixtures/base-fixtures.ts`, `framework/pages/LoginPage.ts`; see lesson 09.

```ts
export const test = base.extend<FrameworkFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
});
```

- **Breakdown:** `base` is Playwright's normal test; `FrameworkFixtures` names the new fixture; `loginPage` receives Playwright's `page`; `use()` gives the object to the test.
- **Connection:** Test destructures `{ loginPage }`, calls `open()` and `login()`, and the Page Object uses config, wrappers, and logger.
- **Exercise:** Add an `employeePage` fixture that only creates and returns a new `EmployeePage` object.
- **Outcome:** Trainees can create and consume one custom fixture in an existing framework.
- **Skip:** Worker-scoped fixtures, fixture dependency chains, automatic login state, and advanced lifecycle options.
- **Trainer guidance:** Draw `base test -> extend -> fixture -> test` before opening the implementation.

### Integration practice

- **Time:** 2 hours
- **Demo flow:** `test -> loginPage fixture -> LoginPage -> CommonActions -> Logger`; `config -> OrangeHRM`; `factory/utils -> employee data`.
- **Trainer task:** Trace one login operation aloud, following every import and returned value.

### Final hands-on: add an employee-registration flow

- **Time:** 2 hours
- **Requirement:** Add an OrangeHRM employee-create test to this framework.
- **Must use:** existing folder structure, `config`, `createUser()`, at least one utility, `logger`, a Page Object, and a fixture.
- **Review checklist:** no hard-coded application URL in the test; no repeated login locators in the test; generated data is unique; assertions validate the visible outcome; all new code is in the correct folder.

## Expected result after 21 hours

Given an existing Playwright framework, a trainee can understand the folder structure, add a test and Page Object method, reuse utilities and a data factory, run against a selected environment, add useful logging, use a simple action wrapper, recognize global setup/teardown, and create or consume one custom fixture. They can modify these patterns confidently without needing to design enterprise framework architecture.
