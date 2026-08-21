// Topic 1: Variables, data types, and type inference
// Inference = TypeScript guesses the type for us.

let caseTitle = "Login case";      // string
let attemptCount = 3;             // number
let isReady = true;               // boolean

// Type = the kind of value a variable can hold.
let anyValue: any = "hello";      // any means it can change to any type
anyValue = 5;
anyValue = false;

// unknown = safer than any. We must check it before using it.
let unknownValue: unknown = "hello";

if (typeof unknownValue === "string") {
    console.log(unknownValue.toUpperCase());
}

// never = this function will not finish normally.
function stopProcess(message: string): never {
    throw new Error(message);
}

console.log(caseTitle);
console.log(attemptCount);
console.log(isReady);
console.log(anyValue);
