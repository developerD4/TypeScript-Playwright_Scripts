// framework/core/safeActions.ts
//
// Thin wrappers around common Playwright Locator actions that add:
//   - centralized retry with backoff for transient failures
//   - consistent logging of what was attempted and what failed
//   - a single place to change retry/timeout policy for the whole framework
//
// Playwright's own auto-waiting already handles most timing flakiness (see
// tests/05-Assertions & Validations/03-auto-retrying-assertions.spec.ts),
// so reach for this wrapper for actions that can fail for reasons
// auto-waiting doesn't cover — e.g. a click that lands but gets swallowed
// by a page that re-renders mid-click, or a flaky third-party widget.

import type { Locator } from '@playwright/test';
import { Logger } from '../logger/logger';

export interface RetryOptions {
  retries?: number;
  delayMs?: number;
}

const DEFAULT_RETRIES = 3;
const DEFAULT_DELAY_MS = 300;

export class SafeActions {
  constructor(private readonly logger: Logger = new Logger('safeActions')) {}

  async safeClick(locator: Locator, options: RetryOptions = {}): Promise<void> {
    await this.withRetry(`click ${this.describe(locator)}`, () => locator.click(), options);
  }

  async safeFill(locator: Locator, value: string, options: RetryOptions = {}): Promise<void> {
    await this.withRetry(
      `fill ${this.describe(locator)} with "${value}"`,
      () => locator.fill(value),
      options
    );
  }

  async safeSelectOption(
    locator: Locator,
    value: string,
    options: RetryOptions = {}
  ): Promise<void> {
    await this.withRetry(
      `select "${value}" on ${this.describe(locator)}`,
      () => locator.selectOption(value),
      options
    );
  }

  /** Generic retry wrapper for any Playwright action, not just the ones above. */
  async withRetry<T>(
    description: string,
    action: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const retries = options.retries ?? DEFAULT_RETRIES;
    const delayMs = options.delayMs ?? DEFAULT_DELAY_MS;

    let lastError: unknown;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await action();
        if (attempt > 1) {
          this.logger.info(`Succeeded on attempt ${attempt}: ${description}`);
        }
        return result;
      } catch (error) {
        lastError = error;
        this.logger.warn(
          `Attempt ${attempt}/${retries} failed for "${description}": ${(error as Error).message}`
        );
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    this.logger.error(`All ${retries} attempts failed for "${description}"`);
    throw lastError;
  }

  private describe(locator: Locator): string {
    // Locator has no public "selector" getter, but its toString() includes
    // the selector text, which is good enough for a log message.
    return locator.toString();
  }
}
