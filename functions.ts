// functions.ts
// Topic 3: Functions with arrow syntax, optional/default parameters, and return types
// Default parameter = used when no value is passed.
// Optional parameter = may be given or left out.

function greet(name: string): string {
    return "Hello " + name;
}

const addNumbers = (a: number, b: number = 1): number => {
    return a + b;
};

function showMessage(text: string, extra?: string): string {
    if (extra) {
        return text + " " + extra;
    }

    return text;
}

console.log(greet("Asha"));
console.log(addNumbers(5));
console.log(addNumbers(5, 3));
console.log(showMessage("Good morning"));
console.log(showMessage("Good morning", "student"));
