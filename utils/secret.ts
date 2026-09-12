import dotenv from 'dotenv'
export function getSecret(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(
            `Secret ${name} is not available`
        );
    }
    return value;
}
//const password =
// getSecret('PASSWORD');