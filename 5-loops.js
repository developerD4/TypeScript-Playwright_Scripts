// 1. for loop
// ======================================================
console.log('for loop:');
for (let step = 1; step <= 5; step++) {
    console.log('Running test step:', step);
}

// 2. while loop
// ======================================================
console.log('\n while loop:');
let retries = 1;
while (retries <= 3) {
    console.log('Retry attempt:', retries);
    retries += 1;
}

// 3. do-while loop
// ======================================================
console.log('\n do-while loop:');
let testRound = 1;
do {
    console.log('Test round:', testRound);
    testRound += 1;
} while (testRound <= 3);