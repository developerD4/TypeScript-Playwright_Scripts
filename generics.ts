// generics.ts
// Topic 5: Generics for reusable and type-safe helper functions
// Generic = a function that can work with different types.
// <T> = a placeholder for any type.

function wrapValue<T>(value: T): T {
    return value;
}

const nameValue = wrapValue("Asha");
const numberValue = wrapValue(10);

console.log(nameValue);
console.log(numberValue);

function createCard<T extends { name: string }>(item: T): string {
    return "Card for " + item.name;
}

const person = { name: "Ravi", age: 22 };
console.log(createCard(person));
