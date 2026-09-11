import type { Page, Locator } from '@playwright/test';
import { logger } from '../logger/logger';

// Common action wrappers add logging and error handling.
export class CommonActions {
  async fillText(locator: Locator, value: string, fieldName: string): Promise<void> {
    try {
      logger.info(`Entering value in ${fieldName}`);
      await locator.fill(value);
    } catch (error) {
      logger.error(`Could not enter value in ${fieldName}`);
      throw error;
    }
  }
  async clickElement(locator: Locator, elementName: string): Promise<void> {
    try {
      logger.info(`Clicking ${elementName}`);
      await locator.click();
      logger.info(`${elementName} clicked successfully`);
    } catch (error) {
      logger.error(`Could not click ${elementName}`);
      throw error;
    }
  }
}
//A wrapper method is a reusable method that performs a Playwright action and adds common behavior such as logging and error handling.
