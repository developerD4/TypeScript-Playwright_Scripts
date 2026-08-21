// framework/config/env.ts
//
// Loads the right .env.<environment> file based on the TEST_ENV variable,
// and exposes a single typed `config` object for the rest of the framework
// to import instead of reading process.env directly everywhere.
//
// Usage:
//   TEST_ENV=qa npx playwright test        (bash)
//   $env:TEST_ENV='qa'; npx playwright test (PowerShell)
//   npm run test:qa                         (uses cross-env, see package.json)
// Defaults to "dev" if TEST_ENV is not set.

import path from 'path';
import dotenv from 'dotenv';

export type Environment = 'dev' | 'qa' | 'staging' | 'production';

const VALID_ENVIRONMENTS: Environment[] = ['dev', 'qa', 'staging', 'production'];

function resolveEnvironment(): Environment {
  const requested = (process.env.TEST_ENV ?? 'dev') as Environment;
  if (!VALID_ENVIRONMENTS.includes(requested)) {
    throw new Error(
      `Unknown TEST_ENV "${requested}". Expected one of: ${VALID_ENVIRONMENTS.join(', ')}`
    );
  }
  return requested;
}

const environment = resolveEnvironment();

// Repo root is two levels up from framework/config/.
const repoRoot = path.resolve(__dirname, '..', '..');
dotenv.config({ path: path.join(repoRoot, `.env.${environment}`) });

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var "${key}" for environment "${environment}"`);
  }
  return value;
}

export const config = {
  env: environment,
  isProduction: environment === 'production',
  baseURL: requireEnv('BASE_URL'),
  apiTimeoutMs: Number(process.env.API_TIMEOUT_MS ?? 30000),
  username: requireEnv('TEST_USERNAME'),
  password: requireEnv('TEST_PASSWORD'),
} as const;

/**
 * Throws if the active environment is production. Call this at the top of
 * any destructive action (deleting a record, resetting data, seeding test
 * accounts) that must never accidentally run for real — see
 * tests/09-Test Data & Environment Management/05-multiple-environment-configurations.spec.ts
 * for the full usage pattern.
 */
export function assertNotProduction(actionDescription: string): void {
  if (config.isProduction) {
    throw new Error(
      `Refusing to run "${actionDescription}" — TEST_ENV is "production". ` +
        'This guard exists to stop destructive test actions from ever running against a real production environment by accident.'
    );
  }
}
