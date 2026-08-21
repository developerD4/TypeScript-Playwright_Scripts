// 05-custom-logger.spec.ts
//
// TOPIC: implementing a custom logger for consistent test execution logs
//
// Framework code under test: framework/logger/logger.ts
//
// Run this file with `npx playwright test 05-custom-logger --reporter=list`
// and watch the terminal — every line below is timestamped, leveled, and
// scoped, instead of a bare, context-free console.log().

import { test, expect } from '@playwright/test';
import { Logger } from '../../framework/logger/logger';

test('logger prints one consistently-formatted line per call', () => {
  const logger = new Logger('05-custom-logger demo');

  const originalLog = console.log;
  const capturedLines: string[] = [];
  console.log = (line: string) => capturedLines.push(line);

  try {
    logger.debug('a debug-level message');
    logger.info('an info-level message');
    logger.warn('a warn-level message');
    logger.error('an error-level message');
  } finally {
    console.log = originalLog; // always restore, even if an assertion below throws
  }

  expect(capturedLines).toHaveLength(4);
  for (const line of capturedLines) {
    // Every line carries an ISO timestamp and the logger's scope name,
    // which is the whole point: consistent structure you can grep/parse,
    // instead of every call site formatting its own ad hoc message.
    expect(line).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
    expect(line).toContain('[05-custom-logger demo]');
  }
  expect(capturedLines[0]).toContain('[DEBUG]');
  expect(capturedLines[1]).toContain('[INFO]');
  expect(capturedLines[2]).toContain('[WARN]');
  expect(capturedLines[3]).toContain('[ERROR]');
});

test('child() scopes a logger to a sub-step without losing the parent scope', () => {
  const logger = new Logger('checkout flow');
  const stepLogger = logger.child('payment step');

  const originalLog = console.log;
  let capturedLine = '';
  console.log = (line: string) => (capturedLine = line);

  try {
    stepLogger.info('charging card');
  } finally {
    console.log = originalLog;
  }

  expect(capturedLine).toContain('[checkout flow > payment step]');
});

test('using a logger inline in a real test, the way you would day to day', async ({ page }) => {
  const logger = new Logger('inline usage demo');

  logger.info('Navigating to SauceDemo');
  await page.goto('https://www.saucedemo.com');

  logger.info('Logging in as standard_user');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  await expect(page).toHaveURL(/inventory\.html/);
  logger.info('Login succeeded, reached inventory page');
});
