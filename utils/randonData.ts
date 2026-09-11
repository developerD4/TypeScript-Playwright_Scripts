export function generateUniqueName(): string {

    return `TestUser_${Date.now()}`;
}

export function generateUniqueEmail(): string {

    return `test_${Date.now()}@example.com`;
}

export function generateRandomNumber(): string {

    return Math.floor(
        10000 + Math.random() * 90000
    ).toString();
}


//Execute
const name = generateUniqueName();

const email = generateUniqueEmail();

console.log(name);
console.log(email);