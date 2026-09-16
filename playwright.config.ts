import { defineConfig, devices } from '@playwright/test';
import { baseUrl } from './config/environment';

// This file controls how Playwright runs every test.
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['allure-playwright']],
  // globalSetup: './global-setup',
  // globalTeardown: './global-teardown',
  timeout: 50000,
  use: {
    // Page Objects use this value with page.goto('/').
    // baseURL: baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});