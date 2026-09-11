// 06-handling-sensitive-data-and-secrets.spec.ts
//
// TOPIC: handling sensitive data — environment variables, secrets, and
// vault-based storage
//
// Helper code under test: ./security/secrets.ts
//
// IMPORTANT: the credentials in .env.dev/.env.qa/.env.staging/.env.production
// at the repo root are NOT real secrets — they're SauceDemo's own publicly
// documented demo accounts, printed right on its login page. They're
// committed to this repo on purpose, as example config values. A REAL
// project's secrets (real API keys, real database passwords, real tokens)
// should never be committed like that — they belong in a `.env.local`
// file listed in `.gitignore` (see the root `.gitignore` in this repo,
// which already excludes common secret-bearing paths), injected by your
// CI system's secret store, or fetched from a vault at runtime.

import { test, expect } from '@playwright/test';
import { fetchSecretFromVault, maskSecret, requireSecret } from './security/secrets';

test.describe('maskSecret() — safe to put in a log line', () => {
  test('shows only the first and last two characters', () => {
    const masked = maskSecret('sk_live_51Abc9XyzTokenValue');

    expect(masked.startsWith('sk')).toBe(true);
    expect(masked.endsWith('ue')).toBe(true);
    expect(masked).toBe('sk' + '*'.repeat('sk_live_51Abc9XyzTokenValue'.length - 4) + 'ue');
  });

  test('fully masks very short secrets instead of leaking most of them', () => {
    // A short 3-4 character secret revealing "first 2 / last 2" would
    // leak almost the whole thing — mask it completely instead.
    expect(maskSecret('abcd')).toBe('****');
    expect(maskSecret('ab')).toBe('**');
  });

  test('the masked value never contains the original secret as a substring', () => {
    const secret = 'super-secret-api-key-12345';
    const masked = maskSecret(secret);

    expect(masked).not.toContain(secret);
    expect(masked.length).toBe(secret.length); // same length, so a reader still sees roughly how long it was
  });
});

test.describe('requireSecret() — fail fast instead of silently continuing with undefined', () => {
  const TEST_VAR_NAME = 'DEMO_TEST_SECRET_FOR_THIS_SPEC';

  test.afterEach(() => {
    delete process.env[TEST_VAR_NAME]; // don't leak this test's env var into other tests
  });

  test('returns the value when the env var is set', () => {
    process.env[TEST_VAR_NAME] = 'a-real-looking-value';
    expect(requireSecret(TEST_VAR_NAME)).toBe('a-real-looking-value');
  });

  test('throws a clear, non-leaking error when the env var is missing', () => {
    delete process.env[TEST_VAR_NAME];

    // The error message names WHICH variable is missing (useful for
    // debugging a broken CI setup) without ever having a value to leak in
    // the first place.
    expect(() => requireSecret(TEST_VAR_NAME)).toThrow(
      `Missing required secret: process.env.${TEST_VAR_NAME} is not set.`
    );
  });
});

test.describe('fetchSecretFromVault() — same call site, real vault or not', () => {
  const VAULT_VAR_NAME = 'DEMO_VAULT_SECRET_FOR_THIS_SPEC';

  test.afterEach(() => {
    delete process.env[VAULT_VAR_NAME];
  });

  test('resolves with the secret value, wherever it actually came from', async () => {
    // In this repo it reads process.env directly; in a real pipeline the
    // SAME function signature would instead call out to Vault/Secrets
    // Manager. Code that calls fetchSecretFromVault() doesn't need to
    // change either way — that's the point of putting a function
    // boundary around "how do we get this secret" at all.
    process.env[VAULT_VAR_NAME] = 'vault-issued-token-abc123';

    const token = await fetchSecretFromVault(VAULT_VAR_NAME);
    expect(token).toBe('vault-issued-token-abc123');
  });
});

test('real usage: logging around a login action without ever printing the password', async ({
  page,
}) => {
  const username = 'standard_user';
  const password = 'secret_sauce';

  // This is what a log line SHOULD look like around sensitive input — the
  // password's masked form proves one was used, without ever printing it.
  // eslint-disable-next-line no-console
  console.log(`Logging in as "${username}" with password "${maskSecret(password)}"`);

  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill(username);
  await page.locator('#password').fill(password); // the REAL value still goes into the form — only logging is masked
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);
});
