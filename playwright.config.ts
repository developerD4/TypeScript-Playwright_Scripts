import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Run once before/after the whole suite — see framework/global-setup.ts
   * and framework/global-teardown.ts (topic: Framework Development &
   * Reusable Utilities). These also load the env-specific .env file via
   * framework/config/env.ts, since it's imported from global-setup.ts. */
  globalSetup: require.resolve('./framework/global-setup'),
  globalTeardown: require.resolve('./framework/global-teardown'),
  // /* Fail the build on CI if you accidentally left test.only in the source code. */
  // forbidOnly: !!process.env.CI,
  // /* Retry on CI only */
  // retries: process.env.CI ? 2 : 0,
  // /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  /* Reporter(s) to use — an array runs more than one at once. See
   * https://playwright.dev/docs/test-reporters and topic 10,
   * "Reporting, Debugging & Failure Analysis", file 01, for what each
   * option below does and how to customize it further. */
  reporter: [
    ['list'], // concise pass/fail lines streamed to the terminal as tests run
    ['html', { outputFolder: 'playwright-report', open: 'never' }], // rich report — `npx playwright show-report` to view
    // Writes raw result files Allure's own CLI later turns into a report —
    // see topic 11, "Allure Reporting", for the full generate/open workflow.
    ['allure-playwright', { resultsDir: 'allure-results', detail: true, suiteTitle: false }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
     * and topic 10, file 02, for how to read one with Trace Viewer. */
    trace: 'on-first-retry',

    /* Capture a screenshot / video only for tests that actually fail —
     * see topic 10, file 05, for the full set of options and trade-offs. */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
