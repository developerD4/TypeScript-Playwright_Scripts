import { test, expect } from '@playwright/test';

test('global setup ran before the suite', () => {
  expect(process.env.FRAMEWORK_SETUP_RAN).toBe('yes');
});

/*
beforeEach      -> before every test
beforeAll       -> once in one test file
globalSetup     -> once before all test files
globalTeardown  -> once after all test files
*/
