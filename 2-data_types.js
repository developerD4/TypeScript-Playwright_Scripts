// data_types.js
// Basic JavaScript data types in a test automation context.

// String
const testName = 'Login test';
console.log('testName:', testName, '| type:', typeof testName);

// Number
const testDuration = 25;
console.log('testDuration:', testDuration, '| type:', typeof testDuration);

// Boolean
const isTestPassing = false;
console.log('isTestPassing:', isTestPassing, '| type:', typeof isTestPassing);

// Undefined
let testComment;
console.log('testComment:', testComment, '| type:', typeof testComment);

// Null
const testNote = null;
console.log('testNote:', testNote, '| type:', typeof testNote); // typeof null is an odd JavaScript quirk

// Object
const testCase = { id: 1, name: 'Login test' };
console.log('testCase:', testCase, '| type:', typeof testCase);

// Array
const testSteps = ['Open app', 'Enter credentials', 'Submit'];
console.log('testSteps:', testSteps, '| type:', typeof testSteps);

// Symbol
const testId = Symbol('testId');
console.log('testId:', testId, '| type:', typeof testId);
