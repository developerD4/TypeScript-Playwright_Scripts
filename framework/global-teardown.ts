// Runs once after the complete test suite.
import { logger } from './logger/logger';

async function globalTeardown(): Promise<void> {
  logger.info('Test run finished. Add shared cleanup here when needed.');
}

export default globalTeardown;
