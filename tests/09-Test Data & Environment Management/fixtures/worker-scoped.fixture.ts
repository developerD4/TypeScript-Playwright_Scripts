// fixtures/worker-scoped.fixture.ts
//
// TOPIC 7 support code: demonstrates the difference between WORKER-scoped
// and TEST-scoped fixture data — the two building blocks for keeping test
// data isolated when Playwright runs many tests in parallel across
// several worker processes.

import { test as base, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

interface WorkerScopedFixtures {
  /** Created ONCE per worker PROCESS. Every test that happens to run on this worker shares this same value. */
  workerSeededUsername: string;
}

interface TestScopedFixtures {
  /** Created fresh for EVERY test, regardless of which worker runs it. */
  uniqueTestEmail: string;
}

export const test = base.extend<TestScopedFixtures, WorkerScopedFixtures>({
  workerSeededUsername: [
    async ({}, use, workerInfo) => {
      // workerInfo.workerIndex uniquely identifies this worker PROCESS —
      // baking it into the value guarantees no two workers ever produce
      // the same "worker username", even if they happened to generate the
      // same random suffix.
      const username = `worker${workerInfo.workerIndex}_${faker.string.alphanumeric(6)}`;
      await use(username);
    },
    { scope: 'worker' },
  ],

  uniqueTestEmail: async ({}, use) => {
    await use(faker.internet.email());
  },
});

export { expect };
