// 06-environment-agnostic-config-driven-tests.spec.ts
//
// TOPIC: writing environment-agnostic, config-driven test scripts
//
// Framework code reused here: framework/config/env.ts (built in topic 06,
// "Framework Development & Reusable Utilities" — see that folder's
// 04-env-config-management.spec.ts for the config mechanism itself).
//
// "Environment-agnostic" means this file contains ZERO hardcoded URLs or
// credentials — nothing in it says "dev" or "qa" anywhere. Everything
// environment-specific comes from `config`, which itself is driven by the
// TEST_ENV variable (see .env.dev / .env.qa / .env.staging at the repo
// root). Run this exact file against three different environments with:
//   npm run test:dev
//   npm run test:qa
//   npm run test:staging

import { test, expect } from '@playwright/test';
import { config } from '../../framework/config/env';

test('login uses whichever base URL and credentials belong to the active environment', async ({
  page,
}) => {
  // Not 'https://www.saucedemo.com' — the test doesn't know or care which
  // real URL that resolves to. Point config.baseURL at a totally
  // different server for "staging" and this test doesn't change at all.
  await page.goto(config.baseURL);

  await page.locator('#user-name').fill(config.username);
  await page.locator('#password').fill(config.password);
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(new RegExp(`${config.baseURL}/inventory.html`));
});

test('a network call respects the environment-specific timeout budget', async ({ request }) => {
  // A slower staging environment might legitimately need a longer timeout
  // than a fast local/dev one — config.apiTimeoutMs is set per
  // environment (see .env.staging vs .env.dev) instead of a single
  // hardcoded number that's either too tight for staging or wastefully
  // long for dev.
  const response = await request.get(config.baseURL, { timeout: config.apiTimeoutMs });
  expect(response.ok()).toBe(true);
});

test('nothing in this file needs to change to add a fourth environment', () => {
  // Adding, say, a "prod-readonly" environment is a matter of creating
  // .env.prod-readonly and adding it to the Environment type + npm script
  // — see framework/config/env.ts. Every test file written this way
  // (importing `config` instead of hardcoding values) automatically works
  // against it, with no test code changes anywhere.
  expect(['dev', 'qa', 'staging', 'production']).toContain(config.env);
});
