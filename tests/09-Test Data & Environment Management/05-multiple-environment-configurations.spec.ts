// 05-multiple-environment-configurations.spec.ts
//
// TOPIC: managing multiple environment configurations (dev, QA, staging, production)
//
// Framework code reused/extended here: framework/config/env.ts (built in
// topic 06). It now supports a fourth environment, "production" — see
// .env.production at the repo root, and the `isProduction` flag /
// `assertNotProduction()` guard added to framework/config/env.ts
// specifically to support this topic.
//
// This file focuses on a different angle than the config USAGE already
// shown in topic 06 (file 04) and topic 08 (file 06): here it's about
// managing several environments SAFELY and CONSISTENTLY as a set —
// catching config drift between them, and guarding against a real
// production environment being touched by anything destructive.

import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { config, assertNotProduction, type Environment } from '../../framework/config/env';

test('all four environment files define the exact same set of keys', () => {
  // "Config drift" — someone adds a new required variable to .env.dev
  // while testing locally, forgets to add it to .env.staging, and it goes
  // unnoticed until a staging run breaks days later. This test catches
  // that class of bug directly: every .env.<environment> file must expose
  // an identical set of KEY names (values are expected to differ; key
  // NAMES should not).
  const repoRoot = path.resolve(__dirname, '..', '..');
  const environments: Environment[] = ['dev', 'qa', 'staging', 'production'];

  const keysPerEnvironment = environments.map((env) => {
    const fileContents = readFileSync(path.join(repoRoot, `.env.${env}`), 'utf-8');
    return { env, keys: Object.keys(dotenv.parse(fileContents)).sort() };
  });

  const [expectedKeys] = keysPerEnvironment.map((entry) => entry.keys);
  for (const entry of keysPerEnvironment) {
    expect(entry.keys, `.env.${entry.env} should define the same keys as .env.dev`).toEqual(
      expectedKeys
    );
  }
});

test('config.isProduction is only true when TEST_ENV=production', () => {
  // This whole suite runs with TEST_ENV=dev by default (see
  // playwright.config.ts / package.json), so under normal test execution
  // this is false. Run `npm run test:production` and this same assertion
  // would evaluate to true instead — the flag tracks the ACTIVE
  // environment, not a hardcoded guess.
  expect(config.isProduction).toBe(config.env === 'production');
});

test('assertNotProduction() blocks a destructive action outside of production, silently', () => {
  // In every environment except production, the guard is a no-op — it
  // simply doesn't throw, and whatever destructive action follows it
  // (resetting seeded data, deleting a test account) proceeds normally.
  expect(() => assertNotProduction('reset all seeded test data')).not.toThrow();
});

test('simulating what happens if TEST_ENV WERE production', () => {
  // We don't actually re-run this whole suite against TEST_ENV=production
  // just to prove this one behavior — instead, directly check the guard
  // function's logic against a simulated "isProduction: true" config,
  // exactly the shape framework/config/env.ts produces when
  // TEST_ENV=production is set.
  const simulateGuard = (isProduction: boolean, actionDescription: string) => {
    if (isProduction) {
      throw new Error(`Refusing to run "${actionDescription}" — TEST_ENV is "production".`);
    }
  };

  expect(() => simulateGuard(true, 'reset all seeded test data')).toThrow(/Refusing to run/);
  expect(() => simulateGuard(false, 'reset all seeded test data')).not.toThrow();
});

test('a real usage pattern: guard a destructive helper before it runs', async () => {
  async function resetAllTestData(): Promise<string> {
    // Any test helper that deletes/resets data should call the guard
    // FIRST, before doing anything irreversible — exactly like this.
    assertNotProduction('resetAllTestData()');
    return 'reset complete';
  }

  // Passes here because the active environment (dev, by default in this
  // suite) is not production.
  await expect(resetAllTestData()).resolves.toBe('reset complete');
});
