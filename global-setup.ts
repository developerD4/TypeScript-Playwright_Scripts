import { logger } from './logger/logger';
async function globalSetup(): Promise<void> {
  logger.info('Global setup started');
  logger.info('Application is available. Tests can start.');
  logger.info('Global setup completed');
}
export default globalSetup;

//Global Setup is code that Playwright runs once before the complete test suite.
// We use it for common preparation or checks that are needed before testing starts.
// Example: check whether the application is available before running 100 tests.