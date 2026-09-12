import { randomUUID } from 'crypto';
//crypto is a built-in Node.js module that provides functions for generating secure random values, hashes, UUIDs, and encryption-related operations.
export interface User {
    id: string;
    username: string;
    email: string;
}
// Temporary in-memory database
const users: User[] = []; //[{id:1001, username:'test', email:'test@example.com'},{id:1002, username:'test1', email:'test1@example.com'}]
export const fakeDb = {
    // Create a user
    async createUser(username: string, email: string): Promise<User> {
        const user: User = {
            id: randomUUID(),
            username: username,
            email: email
        };
        users.push(user);
        return user;
    },
    // Find a user
    async findUser(id: string): Promise<User | undefined> {
        return users.find(user => user.id === id);
    },

    // Delete a user
    async deleteUser(id: string): Promise<void> {
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            users.splice(index, 1);
        }
    },
    // Count users
    async countUsers(): Promise<number> {
        return users.length;
    },
    // Delete all users
    async deleteAllUsers(): Promise<void> {
        users.length = 0;
    }
};

// 1. Start with a known state – Seeding creates the exact data required before a test runs.
// 2. Make tests repeatable – Cleanup removes the data created by the test, so the next run starts clean.
// 3. Avoid duplicate-data failures – Without cleanup, running the same test again can cause duplicate/unique-constraint errors.
// 4. Keep tests independent – Each test can create its own required data instead of depending on data left behind by another test.
// 5. Reduce dependency on existing database data – The test controls the data it needs instead of relying on whatever records already exist in the database.