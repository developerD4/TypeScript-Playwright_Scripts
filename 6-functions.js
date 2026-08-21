// 1. FUNCTION DECLARATION
// ============================================================
// A function declaration defines a reusable function.
function displayTestName(testName) {
    return `Running test: ${testName}`;
}

console.log(displayTestName('Login flow'));

// ============================================================
// 2. FUNCTION WITH NO PARAMETERS
// ============================================================
// A function does not always need parameters.

function startTest() {
    return 'Test execution started.';
}

console.log(startTest());


// ============================================================
// 3. FUNCTION WITH PARAMETERS
// ============================================================
// Parameters receive values when the function is called.

function displayTestResult(testName, status) {
    return `${testName}: ${status}`;
}

console.log(displayTestResult('Login Test', 'PASS'));


// ============================================================
// 4. FUNCTION EXPRESSION
// ============================================================
// A function can be stored inside a variable.

const calculatePassPercentage = function (passed, total) {
    return (passed / total) * 100;
};

console.log(
    'Pass percentage:',
    calculatePassPercentage(4, 5) + '%'
);


// ============================================================
// 5. ARROW FUNCTION
// ============================================================
// Arrow functions provide a shorter syntax for functions.

const multiplyTestAttempts = (attempts, factor) => {
    return attempts * factor;
};

console.log('Multiply test attempts:', multiplyTestAttempts(3, 5));

// ============================================================
// 6. ARROW FUNCTION WITH IMPLICIT RETURN
// ============================================================
// If there is only one expression,
// curly braces and return can be omitted.

const getTestStatus = (passed) => passed ? 'PASS' : 'FAIL';
console.log('Test status:', getTestStatus(true));

// ============================================================
// 7. DEFAULT PARAMETERS
// ============================================================
// Default values are used when arguments are not provided.

function createTestCase(name = 'New Test', type = 'Smoke') {
    return { name, type };
}
console.log('Default test case:', createTestCase());
console.log(
    'Custom test case:',
    createTestCase('Login test', 'Regression')
);

// ============================================================
// 8. REST PARAMETERS
// ============================================================
// Rest parameters allow a function to accept
// multiple arguments.

function sumFailures(...failCounts) {
    let totalFailures = 0;
    for (const count of failCounts) {
        totalFailures += count;
    }
    return totalFailures;
}
console.log('Total failures:', sumFailures(1, 2, 0, 3));

// ============================================================
// 9. FUNCTION THAT PERFORMS AN ACTION
// ============================================================
// Not every function needs to return a value.
// Some functions simply perform an action.

function logTestStep(stepName) {
    console.log(`Executing step: ${stepName}`);
}
logTestStep('Open application');
logTestStep('Enter username');
logTestStep('Click Login');

// ============================================================
// 10. FUNCTION RETURNING A BOOLEAN
// ============================================================
// Boolean-returning functions are useful for conditions.

function isTestPassed(actualStatus, expectedStatus) {
    return actualStatus === expectedStatus;
}

console.log('Is test passed:', isTestPassed('PASS', 'PASS'));
console.log('Is test passed:', isTestPassed('FAIL', 'PASS'));

// ============================================================
// 11. GLOBAL SCOPE
// ============================================================
// A variable declared outside functions/blocks
// can be accessed from functions.

const globalTestMessage = 'Test runner initialized.';

function showGlobalTestMessage() {
    console.log(globalTestMessage);
}
showGlobalTestMessage();


// ============================================================
// 12. FUNCTION SCOPE
// ============================================================
// A variable declared inside a function
// can only be accessed inside that function.
function displayFunctionScope() {

    const localTestNote =
        'This note exists only inside the function.';

    console.log(localTestNote);
}
displayFunctionScope(); // console.log(localTestNote);

// ============================================================
// 13. BLOCK SCOPE
// ============================================================
// let and const are block scoped.

if (true) {
    let blockTestNote = 'This note exists only inside the block.';
    console.log(blockTestNote);
}
// console.log(blockTestNote);
// ============================================================
// 14. CALLBACK FUNCTION
// ============================================================
// A function can be passed as an argument
// to another function.

function executeTestStep(step, callback) {

    console.log(`Executing: ${step}`);
    callback();
}
function verifyTestResult() {
    console.log('Verifying test result.');
}
executeTestStep('Login', verifyTestResult);

// ============================================================
// 15. ARROW FUNCTION AS CALLBACK
// ============================================================

executeTestStep('Dashboard navigation', () => {
    console.log('Dashboard verification completed.');
});

// ============================================================
// 16. DEFAULT + REST + ARROW FUNCTION
// ============================================================

const joinTestSteps = (separator, ...steps) => {
    return steps.join(separator);
};
console.log(joinTestSteps(' -> ', 'Open app', 'Login', 'Verify page'));
console.log(joinTestSteps(' | ', 'Setup', 'Execute', 'Report'));