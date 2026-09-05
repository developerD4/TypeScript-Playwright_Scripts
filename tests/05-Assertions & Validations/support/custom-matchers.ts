import { expect as baseExpect, test as baseTest } from '@playwright/test';

// Create our own expect
// It contains all normal Playwright assertions
// plus our custom assertion
export const expect = baseExpect.extend({

  toHaveTextLength(received: string, expectedLength: number) {

    const actualLength = received.length;

    const pass = actualLength === expectedLength;

    return {
      pass,
      message: () =>
        `Expected text length to be ${expectedLength}, but got ${actualLength}`
    };
  }

});

// Export normal Playwright test
export const test = baseTest;