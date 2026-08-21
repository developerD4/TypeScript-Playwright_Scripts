// Promises - Important Topics for Test Automation
// ============================================================
// 1. BASIC PROMISE
// ============================================================
// Promise represents an operation that finishes in the future.

function fakeTestApiCall() {
    const testPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            const testPassed = true;
            if (testPassed) {
                resolve({
                    status: 200,
                    message: 'Test case created'
                });
            } else {
                reject(new Error('Test API failed'));
            }
        }, 1000);
    });
    return testPromise;
}
console.log('Starting test API call...');

fakeTestApiCall().then(response => { console.log('Test passed:', response); }).catch(error => {
    console.log('Test failed:', error.message);
});

// ============================================================
// 2. DYNAMIC PROMISE CREATION
// ============================================================
// A function can create a Promise based on input.

function runTest(testName, passed) {

    const testPromise = new Promise((resolve, reject) => {

        if (passed) {
            resolve(`${testName}: PASS`);
        } else {
            reject(`${testName}: FAIL`);
        }
    });

    return testPromise;
}

runTest('Login test', true)
    .then(result => console.log(result))
    .catch(error => console.log(error));


// ============================================================
// 3. Promise.resolve()
// ============================================================
// Creates an already successful Promise.

const successfulPromise = Promise.resolve('Test data loaded');

successfulPromise.then(result => {
    console.log('resolve:', result);
});


// ============================================================
// 4. Promise.reject()
// ============================================================
// Creates an already failed Promise.

const failedPromise = Promise.reject('Test data not found');

failedPromise.catch(error => {
    console.log('reject:', error);
});


// ============================================================
// 5. Promise.all()
// ============================================================
// Waits for ALL Promises to complete successfully.

const login = Promise.resolve('Login passed');
const search = Promise.resolve('Search passed');
const logout = Promise.resolve('Logout passed');

const allTests = Promise.all([
    login,
    search,
    logout
]);

allTests
    .then(results => {
        console.log('all:', results);
    })
    .catch(error => {
        console.log('all error:', error);
    });


// ============================================================
// 6. Promise.allSettled()
// ============================================================
// Waits for ALL Promises, whether they pass or fail.

const test1 = Promise.resolve('Login passed');
const test2 = Promise.reject('Checkout failed');
const test3 = Promise.resolve('Search passed');

const allResults = Promise.allSettled([
    test1,
    test2,
    test3
]);

allResults.then(results => {
    console.log('allSettled:', results);
});


// ============================================================
// 7. Promise.race()
// ============================================================
// Returns the result of the FIRST Promise to finish.

const fastTest = new Promise(resolve => {

    setTimeout(() => {
        resolve('Fast test completed');
    }, 1000);

});

const slowTest = new Promise(resolve => {

    setTimeout(() => {
        resolve('Slow test completed');
    }, 2000);

});

const firstTest = Promise.race([
    fastTest,
    slowTest
]);

firstTest.then(result => {
    console.log('race:', result);
});


// ============================================================
// 8. Promise.any()
// ============================================================
// Returns the FIRST Promise that successfully completes.

const browser1 = Promise.reject('Chromium failed');
const browser2 = Promise.resolve('Firefox passed');
const browser3 = Promise.resolve('WebKit passed');

const firstSuccessfulTest = Promise.any([
    browser1,
    browser2,
    browser3
]);

firstSuccessfulTest
    .then(result => {
        console.log('any:', result);
    })
    .catch(error => {
        console.log('All browser tests failed');
    });