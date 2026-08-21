// enums-config.ts
// Examples of enums for browser types, environments, and configuration values

// Browser types commonly used with browser automation
export enum BrowserType {
    Chromium = 'chromium',
    Firefox = 'firefox',
    Webkit = 'webkit',
}

// Test environments
export enum Environment {
    Local = 'local',
    Staging = 'staging',
    Production = 'production',
}

// A configuration object using those enums
export interface TestConfig {
    browser: BrowserType;
    environment: Environment;
    headless: boolean;
    baseUrl?: string; // optional: may be provided for some environments
}

// Simple factory to get defaults per environment
export function getDefaultConfig(env: Environment): TestConfig {
    switch (env) {
        case Environment.Local:
            return { browser: BrowserType.Chromium, environment: env, headless: false, baseUrl: 'http://localhost:3000' };
        case Environment.Staging:
            return { browser: BrowserType.Chromium, environment: env, headless: true, baseUrl: 'https://staging.example.com' };
        case Environment.Production:
            return { browser: BrowserType.Chromium, environment: env, headless: true, baseUrl: 'https://www.example.com' };
        default:
            return { browser: BrowserType.Chromium, environment: env, headless: true };
    }
}

// Example of using the enums
export const myConfig = getDefaultConfig(Environment.Local);
