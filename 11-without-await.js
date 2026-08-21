// 11-without-await.js
//
// ASYNC FUNCTIONS WITHOUT AWAIT: calling an async function but not putting
// "await" in front of it. JavaScript starts that function running, but
// does NOT pause to wait for it - execution moves straight to the next
// line. This is sometimes called "fire and forget".
//
// Why testers care: not every async step needs to block your test.
// Uploading a result to a reporting tool, for example, isn't something the
// rest of the test needs to wait on. But setting up test data that a later
// step depends on DOES need to be awaited, or the next step may run before
// the data exists.

function fakeTestApiCall(label, delayMs) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(`${label} finished after ${delayMs}ms`);
        }, delayMs);
    });
}

// Called WITHOUT await: the test doesn't need this result before moving on,
// so we let it run in the background and just log when it eventually finishes.
async function sendTestResultToReport() {
    const message = await fakeTestApiCall('Report upload', 2000);
    console.log(message);
}

// Called WITH await: the next test step needs this data to exist first,
// so we must pause here until it is ready.
async function setupTestData() {
    console.log('Setting up test data...');
    const message = await fakeTestApiCall('Test data setup', 1000);
    console.log(message);
}

async function runTest() {
    console.log('Test started');

    // No "await" here - this call starts, but runTest does not wait for it.
    sendTestResultToReport();

    // "await" here - runTest pauses on this line until setup finishes.
    await setupTestData();

    console.log('Continuing test after data setup');
    console.log('Test finished');
}

runTest();

// Expected order:
// 1. Test started
// 2. Setting up test data...
// 3. Continuing test after data setup   (after ~1000ms, setupTestData finished)
// 4. Test finished
// 5. Report upload finished after 2000ms (fires later, on its own, in the background)
