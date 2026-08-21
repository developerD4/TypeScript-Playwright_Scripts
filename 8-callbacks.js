// 8-callbacks.js
// Callback Functions - Test Automation Examples
//"When your work is finished, run this function. After this testing operation finishes, perform this next action."

// 1. Basic Callback

function executeTest(testName, callback) {
    console.log(`Executing: ${testName}`);

    callback();
}

function testCompleted() {
    console.log('Test completed.');
}

executeTest('Login test', testCompleted);


// 2. Callback with Parameter

function runTest(testName, callback) {

    const result = `${testName} passed`;

    callback(result);
}

runTest('Search test', function (result) {
    console.log('Test result:', result);
});


// 3. Callback with Arrow Function

function executeTestStep(stepName, callback) {

    console.log(`Executing: ${stepName}`);

    callback();
}

executeTestStep('Open application', () => {

    console.log('Application opened.');

});


// 4. Callback with Success / Failure

function checkTestResult(passed, callback) {

    if (passed) {
        callback('PASS');
    } else {
        callback('FAIL');
    }
}

checkTestResult(true, (status) => {

    console.log('Test status:', status);

});


// 5. Asynchronous Callback

function fakeTestExecution(callback) {

    console.log('Test started.');

    setTimeout(() => {

        callback('Test execution completed.');

    }, 1000);
}

fakeTestExecution((result) => {

    console.log(result);

});

console.log('Test continues...');