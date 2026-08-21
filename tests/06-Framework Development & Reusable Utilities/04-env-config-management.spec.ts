// 04-env-config-management.spec.ts
//
// TOPIC: environment/config management using dotenv and multiple env files
//
// Framework code under test: framework/config/env.ts
// Env files: .env.dev, .env.qa, .env.staging (repo root)
//
// This repo doesn't have real separate dev/qa/staging servers (it's a
// training repo pointed at public demo sites), so all three .env files
// point BASE_URL at the same SauceDemo instance. What genuinely differs
// per file is TEST_USERNAME — dev/qa/staging each log in as a different
// SauceDemo demo account, so switching TEST_ENV produces an observably
// different test run, the same way pointing at a different real server
// would.
//
// Run this file against each environment to see the difference:
//   npm run test:dev      -> logs in as standard_user            (works normally)
//   npm run test:qa       -> logs in as problem_user             (images are broken)
//   npm run test:staging  -> logs in as performance_glitch_user  (slow to load)
//
// (Those npm scripts are defined in package.json and use cross-env to set
// TEST_ENV cross-platform, since Windows/macOS/Linux set env vars differently.)

import { test, expect } from '@playwright/test';
import { config } from '../../framework/config/env';

test('config exposes the environment selected by TEST_ENV', () => {
  expect(['dev', 'qa', 'staging', 'production']).toContain(config.env);
  expect(config.baseURL).toBe('https://www.saucedemo.com');
  expect(config.username.length).toBeGreaterThan(0);
  expect(config.apiTimeoutMs).toBeGreaterThan(0);
});

test('logging in uses whichever credentials belong to the active environment', async ({ page }) => {
  await page.goto(config.baseURL);

  await page.locator('#user-name').fill(config.username);
  await page.locator('#password').fill(config.password);
  await page.locator('#login-button').click();

  // All three SauceDemo demo users configured across dev/qa/staging can
  // log in successfully — it's what happens AFTER login that differs
  // (problem_user has broken product images, performance_glitch_user is
  // slow). Run with different TEST_ENV values and inspect the report to
  // see that difference for yourself.
  await expect(page).toHaveURL(/inventory\.html/);
});
