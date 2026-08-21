// 06-wrapper-safe-actions.spec.ts
//
// TOPIC: wrapper methods around Playwright actions for centralized
// retry/error handling
//
// Framework code under test: framework/core/safeActions.ts
// Site used: https://www.saucedemo.com (see sites.txt #3)

import { test, expect } from '@playwright/test';
import { SafeActions } from '../../framework/core/safeActions';
import { Logger } from '../../framework/logger/logger';

test('safeFill()/safeClick() perform the same action as the plain Playwright calls', async ({
  page,
}) => {
  const safeActions = new SafeActions(new Logger('safe-actions demo'));

  await page.goto('https://www.saucedemo.com');

  await safeActions.safeFill(page.locator('#user-name'), 'standard_user');
  await safeActions.safeFill(page.locator('#password'), 'secret_sauce');
  await safeActions.safeClick(page.locator('#login-button'));

  await expect(page).toHaveURL(/inventory\.html/);
});

test('withRetry() retries a flaky action until it succeeds', async () => {
  const safeActions = new SafeActions(new Logger('retry demo'));

  // Simulate an action that fails the first two times, then succeeds —
  // standing in for something like a click that's occasionally swallowed
  // by a re-render, without depending on a real page actually being flaky
  // (which wouldn't be reliable to demonstrate in an example test).
  let attempts = 0;
  const flakyAction = async () => {
    attempts++;
    if (attempts < 3) {
      throw new Error(`Simulated transient failure on attempt ${attempts}`);
    }
    return 'success';
  };

  const result = await safeActions.withRetry('a flaky action', flakyAction, {
    retries: 5,
    delayMs: 10, // short delay so this test runs quickly
  });

  expect(result).toBe('success');
  expect(attempts).toBe(3);
});

test('withRetry() gives up and throws after exhausting all attempts', async () => {
  const safeActions = new SafeActions(new Logger('retry-exhausted demo'));

  let attempts = 0;
  const alwaysFailingAction = async () => {
    attempts++;
    throw new Error('Simulated permanent failure');
  };

  await expect(
    safeActions.withRetry('an action that never succeeds', alwaysFailingAction, {
      retries: 3,
      delayMs: 10,
    })
  ).rejects.toThrow('Simulated permanent failure');

  expect(attempts).toBe(3); // tried exactly `retries` times, no more
});

test('safeSelectOption() wraps selectOption with the same retry behavior', async ({ page }) => {
  const safeActions = new SafeActions(new Logger('select demo'));

  await page.goto('https://www.saucedemo.com');
  await safeActions.safeFill(page.locator('#user-name'), 'standard_user');
  await safeActions.safeFill(page.locator('#password'), 'secret_sauce');
  await safeActions.safeClick(page.locator('#login-button'));

  await safeActions.safeSelectOption(page.locator('[data-test="product-sort-container"]'), 'lohi');

  await expect(page.locator('[data-test="product-sort-container"]')).toHaveValue('lohi');
});
