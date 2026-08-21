// 1. ARITHMETIC OPERATORS
// ============================================================
const passedTests = 10;
const failedTests = 3;
console.log("Addition :", passedTests + failedTests);
console.log("Subtraction :", passedTests - failedTests);
console.log("Multiplication :", passedTests * 2);
console.log("Division :", passedTests / 2);
console.log("Remainder :", passedTests % 3);

// ============================================================
// 2. ASSIGNMENT OPERATORS
// ============================================================

let executedTests = 5;
console.log("Initial executed tests:", executedTests);
executedTests += 2; // executedTests = executedTests + 2
console.log("After += 2:", executedTests);
executedTests -= 1; // executedTests = executedTests - 1
console.log("After -= 1:", executedTests);

// ============================================================
// 3. COMPARISON OPERATORS
// ============================================================

const expectedStatus = 5;
const actualStatus = "5";

console.log("=== :", expectedStatus === actualStatus);
console.log("!== :", actualStatus !== "FAIL");
console.log("> :", passedTests > failedTests);
console.log("< :", failedTests < passedTests);
console.log(">= :", passedTests >= 10);
console.log("<= :", failedTests <= 3);


// ============================================================
// 4. LOGICAL OPERATORS
// ============================================================

const isLoggedIn = true;
const hasPermission = false;
const hasTestData = false;

const canRunTest = isLoggedIn && hasPermission; // Both conditions must be true.
console.log("Can run test:", canRunTest);
const canUseTestEnvironment = isLoggedIn || hasTestData; // At least one condition must be true.
console.log("Can use test environment:", canUseTestEnvironment);

const isBlocked = false;
console.log("Is user allowed:", !isBlocked); // Changes true to false and changes false to true.
// Practical example

if (isLoggedIn && hasPermission) {
    console.log("User can access the application.");
}
// ============================================================
// 5. INCREMENT AND DECREMENT OPERATORS
// ============================================================
let testCount = 1;
console.log("Initial test count:", testCount);
testCount++;
console.log("After ++:", testCount);
testCount--;
console.log("After --:", testCount);

// // Example with loop
// for (let i = 1; i <= 3; i++) {
//     console.log("Running test case:", i);
// }

// ============================================================
// 6. TERNARY OPERATOR
// ============================================================

const testScore = 85;
const testResult = testScore >= 60 ? "PASS" : "FAIL";
console.log("Test result:", testResult);

// Another example

let browserName = null;
const browser = browserName ?? "chromium"; //nullish coalescing
console.log("Browser:", browser);

// ============================================================
//EXAMPLE
// ============================================================

const username = "testuser";
const password = "Password123";

const isUsernameEntered = username !== "";
const isPasswordEntered = password !== "";
const canLogin = isUsernameEntered && isPasswordEntered;
console.log("Username entered:", isUsernameEntered);
console.log("Password entered:", isPasswordEntered);
console.log("Can login:", canLogin);

// Test status
const expectedTitle = "Dashboard";
const actualTitle = "Dashboard";
const titleMatched = actualTitle === expectedTitle;
console.log("Title matched:", titleMatched);

// Final test result
const finalResult = titleMatched && canLogin ? "TEST PASSED" : "TEST FAILED";
console.log("Final result:", finalResult);