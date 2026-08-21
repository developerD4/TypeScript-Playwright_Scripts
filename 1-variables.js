// 1. var
// 'var' allows redeclaration and function-scoped variables.
var testEnvironment = 'local';
console.log('var testEnvironment initial:', testEnvironment);

testEnvironment = 'staging';
console.log('var testEnvironment reassigned:', testEnvironment);

// 2. let
// 'let' is block-scoped and allows reassignment, but not redeclaration in the same scope.
let retryCount = 3;
retryCount = 5;

let testerName = 'QA_engineer';
let testId = 25;
let isTestActive = true;
let testResult = { status: 'passed' };
let testTags = [1, 2, 3];
let pendingTest;
let testOutcome = null;

console.log('types:', typeof testerName, typeof testId, typeof isTestActive,
    typeof testResult, typeof testTags, typeof pendingTest, typeof testOutcome);
console.log(Array.isArray(testerName))

let testSuite = 'LoginTests';
console.log('testSuite initial:', testSuite);
testSuite = 'PurchaseTests';
console.log('testSuite updated:', testSuite);

let currentTest = 'VerifyLogin';
currentTest = 'VerifyCheckout';
console.log('currentTest:', currentTest);

// 3. const
// 'const' is block-scoped and must be initialized when declared.
const testServerURL = 'https://example.com';
console.log('testServerURL:', testServerURL);

const MAX_RETRIES = 3;
console.log('MAX_RETRIES:', MAX_RETRIES);





// Invalid examples (commented out):
// let 1stName = 'Alice';          // Invalid identifier start
// let first-name = 'Alice';       // Hyphen is subtraction
// const MAX_RETRIES;              // Missing initializer

// ` ` (backtick) — template literal: supports ${expression} interpolation and multi-line strings.
// `Hello ${name}`
// ' ' (single quote) — string literal, no interpolation, must escape inner '.
// 'Hello ' + name
// " " (double quote) — string literal, functionally same as single quotes, must escape inner ".
// "Hello " + name

// var → function‑scoped, hoisted & initialized to undefined, can be redeclared and reassigned.

// let → block‑scoped, hoisted but in Temporal Dead Zone (TDZ), can be reassigned, cannot be redeclared.

// const → block‑scoped, hoisted but in TDZ, cannot be reassigned, cannot be redeclared.