// Testing examples for object and array destructuring, spread, and rest.
const testConfig = { environment: 'staging', retries: 3, headless: true };
const { environment, retries } = testConfig;
console.log('environment:', environment);
console.log('retries:', retries);

const testSteps = ['Login', 'Add item', 'Checkout'];
const [firstStep, secondStep] = testSteps;
console.log('First step:', firstStep);
console.log('Second step:', secondStep);

const [primaryStep, ...remainingSteps] = ['Open app', 'Login', 'Verify dashboard', 'Logout'];
console.log('Primary step:', primaryStep);
console.log('Remaining steps:', remainingSteps);

const defaultTestSettings = { timeout: 3000, retries: 2 };
const userTestSettings = { retries: 5 };
const mergedSettings = { ...defaultTestSettings, ...userTestSettings };
console.log('Merged test settings:', mergedSettings);

const commonSteps = ['Open app', 'Login'];
const extraSteps = ['Add item', 'Checkout'];
const fullTestSteps = [...commonSteps, ...extraSteps];
console.log('Full test steps:', fullTestSteps);