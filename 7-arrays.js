// 7-arrays.js
// Important Array Topics for Test Automation


// 1. Array

const testCases = [
    { id: 1, name: 'Login', passed: true },
    { id: 2, name: 'Checkout', passed: false },
    { id: 3, name: 'Search', passed: true }
];
console.log('All tests:', testCases);

// 2. Array Index and Length
console.log('First test:', testCases[0].name);
console.log('Total tests:', testCases.length);

// 3. map()
// Get test names from all test cases.
const testNames = testCases.map(test => test.name);
console.log('Test names:', testNames);

// 4. filter()
// Get only passed tests.
const passedTests = testCases.filter(test => test.passed);
console.log('Passed tests:', passedTests);

// 5. find()
// Find one specific test.
const loginTest = testCases.find(test => test.name === 'Login');
console.log('Login test:', loginTest);

// 6. forEach()
// Run code for every test case.
testCases.forEach(test => {
    console.log(test.name, test.passed);
});

// 7. some()
// Check whether at least one test failed.
const hasFailedTest = testCases.some(test => !test.passed);
console.log('Any failed test?', hasFailedTest);

// 8. every()
// Check whether all tests passed.
const allPassed = testCases.every(test => test.passed);
console.log('All tests passed?', allPassed);

// 9. includes()
// Check whether a value exists in an array.
const browsers = ['chromium', 'firefox', 'webkit'];
console.log('Firefox available?', browsers.includes('firefox'));

// 10. Object Destructuring
const { id, name, passed } = testCases[0];
console.log(id, name, passed);

// 11. Array Destructuring
const [firstTest, secondTest] = testCases;
console.log('First:', firstTest.name);
console.log('Second:', secondTest.name);

// 12. Spread Operator

const additionalTests = [
    { id: 4, name: 'Logout', passed: true }
];

const allTestCases = [
    ...testCases,
    ...additionalTests
];
console.log('All test cases:', allTestCases);

// 13. Rest Parameter

function showTests(...tests) {
    console.log('Received tests:', tests);
}
showTests('Login', 'Search', 'Logout');