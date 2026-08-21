// 12-event-loop.js
//
// EVENT LOOP: the mechanism JavaScript uses to run one thing at a time,
// while still handling things that finish later (timers, Promises, API
// responses) without freezing the program.
//
// A simple mental model:
//   1. All the plain, synchronous code runs first, top to bottom.
//   2. Once that's done, Promise callbacks (.then/.catch) run next -
//      these are called "microtasks".
//   3. Only after that do things like setTimeout callbacks run - these
//      are called "macrotasks" (or just "tasks").
//
// Why testers care: this explains why console.log order in async test
// scripts isn't always top-to-bottom, and why a Promise callback can run
// before a setTimeout callback even if the setTimeout delay is shorter.

console.log('Test script start');

setTimeout(() => {
    console.log('Delayed test step: timeout callback executed');
}, 1000);

console.log('Test script continues');

Promise.resolve().then(() => {
    console.log('Microtask: promise resolved');
});

console.log('Test script end');

// Expected order:
// 1. Test script start
// 2. Test script continues
// 3. Test script end
// 4. Microtask: promise resolved       (microtasks run before macrotasks)
// 5. Delayed test step: timeout callback executed   (after ~1000ms)