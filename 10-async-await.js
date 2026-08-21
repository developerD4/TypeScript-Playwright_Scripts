// 10-async-await.js
//
// ASYNC/AWAIT: syntax built on top of Promises that lets asynchronous code
// read like normal, top-to-bottom (synchronous) code.
//   - "async" in front of a function means that function always returns a Promise.
//   - "await" in front of a Promise pauses that function (only that
//     function - the rest of the program keeps running) until the Promise
//     settles, then gives back the resolved value (or throws on rejection).
//
// Why testers care: test steps usually happen in order (login, THEN add
// item, THEN checkout). async/await lets you write that order directly,
// instead of chaining many .then() calls.

// shouldSucceed lets us demo both the success path and the failure path
// with the same function, like a test API that can pass or fail.
function fakeTestApiCall(shouldSucceed) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldSucceed) {
                resolve({ status: 200, message: 'Test case created' });
            } else {
                reject(new Error('Test API failed'));
            }
        }, 2000);
    });
}

// A plain async function - no error handling. If fakeTestApiCall() rejects,
// this function's Promise rejects too, and whoever calls createTestCase()
// needs a .catch() (or its own try/catch) to handle it, otherwise the
// program crashes with an unhandled rejection.
async function createTestCase(shouldSucceed) {
    console.log('Calling test API...');
    const response = await fakeTestApiCall(shouldSucceed);
    console.log('Received response:', response);
    return response;
}

// Same idea, but wrapped in try/catch so failures are handled right here
// instead of being left for the caller.
async function safeCreateTestCase(shouldSucceed) {
    try {
        const result = await fakeTestApiCall(shouldSucceed);
        return result;
    } catch (error) {
        console.error('Test API failed:', error.message);
        throw error;
    }
}

async function runTest() {
    console.log('--- Test case expected to pass ---');
    const passResult = await safeCreateTestCase(true);
    console.log('Final result:', passResult);

    console.log('\n--- Test case expected to fail (handled with try/catch) ---');
    try {
        await safeCreateTestCase(false);
    } catch (error) {
        console.log('Failure was caught safely - the script keeps running.');
    }
}

runTest();

// Calling createTestCase(false) directly, with no try/catch and no .catch(),
// would crash the program instead of just logging an error - that's why
// safeCreateTestCase wraps the same call in try/catch above.
// createTestCase(false);