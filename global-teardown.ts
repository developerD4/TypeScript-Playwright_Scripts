import { logger } from './logger/logger';

async function globalTeardown(): Promise<void> {

  logger.info('Global teardown started');

  // Common cleanup can be added here later.

  logger.info('Global teardown completed');
}

export default globalTeardown;