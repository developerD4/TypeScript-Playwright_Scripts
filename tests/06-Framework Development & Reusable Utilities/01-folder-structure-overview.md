# Small Playwright framework structure

```text
framework/
  config/       Reads the selected environment file
  core/         Common Playwright actions with logging
  factories/    Creates reusable test data objects
  fixtures/     Adds shared objects to Playwright tests
  logger/       Writes consistent messages to the terminal
  pages/        Page Objects such as LoginPage
  utils/        Date, random-data, and text helpers
  global-setup.ts
  global-teardown.ts

tests/
  06-Framework Development & Reusable Utilities/
```

## How the pieces work together

```text
Test
  -> fixture gives LoginPage
  -> LoginPage uses CommonActions
  -> CommonActions writes to Logger
  -> LoginPage reads URL from config
  -> config reads .env.dev, .env.qa, or .env.staging
```

Keep test scenarios in `tests/`. Put code that more than one test can use in `framework/`.
