// modules-import-export.ts
// Demonstrates import/export syntax across files for a small test helper.

import { BrowserType, Environment, TestConfig, getDefaultConfig } from './enums-config';
import { fakeAutomationClick } from './async-await-promises';

export function printConfig(config: TestConfig): void {
    console.log('Running tests with:');
    console.log(`Browser: ${config.browser}`);
    console.log(`Environment: ${config.environment}`);
    console.log(`Headless: ${config.headless}`);
}

export async function runSimpleTest(): Promise<void> {
    const config = getDefaultConfig(Environment.Local);
    printConfig(config);
    // Use the fake click to simulate a test step (browser automation)
    await fakeAutomationClick('#start-test');
    console.log('Test finished');
}

// If run directly, execute the simple test
if (require.main === module) {
    runSimpleTest().catch((e) => console.error(e));
}
