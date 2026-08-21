// security/secrets.ts
//
// Utilities for handling sensitive values (API keys, passwords, tokens)
// safely: masking them before they ever reach a log line, and failing
// fast with a clear (but non-leaking) error when a required secret is
// missing — instead of letting `undefined` silently flow into a login
// field or an Authorization header.

/** Redacts a secret for safe logging, keeping just enough visible to recognize which one it is. */
export function maskSecret(value: string): string {
  if (value.length <= 4) return '*'.repeat(value.length);
  const visibleStart = value.slice(0, 2);
  const visibleEnd = value.slice(-2);
  return `${visibleStart}${'*'.repeat(value.length - 4)}${visibleEnd}`;
}

/** Reads a required secret from process.env, failing fast with a clear (non-leaking) error if it's missing. */
export function requireSecret(envVarName: string): string {
  const value = process.env[envVarName];
  if (!value) {
    // Deliberately does not echo `value` — the point is naming WHICH
    // variable is missing, never printing a secret's actual contents.
    throw new Error(`Missing required secret: process.env.${envVarName} is not set.`);
  }
  return value;
}

/**
 * Stands in for a real call to a secrets manager (HashiCorp Vault, AWS
 * Secrets Manager, Azure Key Vault, ...). In a real pipeline, this
 * function would make an authenticated network call to that service and
 * return the secret it holds.
 *
 * This repo has no such service to call, so it reads from an environment
 * variable instead — which is exactly what CI systems typically do
 * anyway: a pipeline step fetches the secret from Vault ONCE, then
 * exposes it to the test process as a normal env var, so the test code
 * itself never talks to Vault directly.
 */
export async function fetchSecretFromVault(secretName: string): Promise<string> {
  return requireSecret(secretName);
}
