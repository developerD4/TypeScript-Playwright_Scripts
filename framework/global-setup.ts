// Runs once before the complete test suite.
import { request } from '@playwright/test';
import { config } from './config/env';
import { logger } from './logger/logger';
async function globalSetup(): Promise<void> {
  logger.info(`Starting tests in ${config.env}`);
  const apiContext = await request.newContext();
  const response = await apiContext.get(config.baseURL, { timeout: config.apiTimeoutMs });
  await apiContext.dispose();
  if (!response.ok()) {
    throw new Error(`Application is not available. Status: ${response.status()}`);
  }
  logger.info('Application is available. Tests can start.');
}
export default globalSetup;
//Global setup runs once before the complete test run, while global teardown runs once after it finishes.
