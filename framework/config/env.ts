// Load the selected .env file and export the values tests need.
import dotenv from 'dotenv';

export type Environment = 'dev' | 'qa' | 'staging' | 'production';

const environment = (process.env.TEST_ENV || 'dev') as Environment;
dotenv.config({ path: `.env.${environment}` });

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
  apiTimeoutMs: Number(process.env.API_TIMEOUT_MS || 30000),
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


//set TEST_ENV=qa
//npx playwright test