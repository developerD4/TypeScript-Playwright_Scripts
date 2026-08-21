// async-await-promises.ts
// Simple examples showing Promises, async/await, and handling browser automation-like async calls.

// Simulated automation API: a function that returns a promise resolving after a delay
function fakeAutomationClick(selector: string): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log(`Simulating click on ${selector}...`);
        setTimeout(() => {
            // Simulate a failure when selector contains 'fail'
            if (selector.includes('fail')) {
                console.log(`Failed to click ${selector}`);
                reject(new Error('Element not found'));
                return;
            }
            console.log(`Clicked ${selector}`);
            resolve();
        }, 500);
    });
}

// 1) Using Promises with then/catch
function exampleWithThen(): void {
    fakeAutomationClick('#btn-login')
        .then(() => {
            console.log('Then: action completed');
        })
        .catch((err) => {
            console.error('Then: error', err.message);
        });
}

// 2) Using async/await (recommended for readability)
async function exampleWithAsyncAwait(): Promise<void> {
    try {
        await fakeAutomationClick('#btn-submit');
        console.log('Async/Await: action completed');
    } catch (err: any) {
        console.error('Async/Await: error', err.message);
    }
}

// 3) Running multiple actions in parallel with Promise.all
async function exampleParallel(): Promise<void> {
    try {
        await Promise.all([
            fakeAutomationClick('#link-1'),
            fakeAutomationClick('#link-2'),
        ]);
        console.log('Parallel actions completed');
    } catch (err: any) {
        console.error('Parallel: error', err.message);
    }
}

// 4) Simulated failure example to teach rejection handling
async function exampleFailure(): Promise<void> {
    try {
        await fakeAutomationClick('#will-fail');
    } catch (err: any) {
        console.log('Handled failure as expected:', err.message);
    }
}

// 5) Example usage
export async function runExamples(): Promise<void> {
    console.log('Running then/catch example');
    exampleWithThen();

    console.log('\nRunning async/await example');
    await exampleWithAsyncAwait();

    console.log('\nRunning parallel example');
    await exampleParallel();

    console.log('\nRunning failure example');
    await exampleFailure();
}

// Only run when this file is executed directly (not when imported as a module)
if (require.main === module) {
    runExamples().catch((e) => console.error(e));
}

export { fakeAutomationClick, exampleWithAsyncAwait };
