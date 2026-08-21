// types-narrowing-unions.ts
// Examples of type narrowing, union and intersection types for flexible test data models.

// Basic user types
type Admin = {
    role: 'admin';
    permissions: string[];
};

type Guest = {
    role: 'guest';
    permissions?: undefined;
};

type RegisteredUser = {
    role: 'user';
    email: string;
};

// Union type: a user can be Admin, Guest, or RegisteredUser
export type User = Admin | Guest | RegisteredUser;

// Function that narrows using a discriminant property
export function describeUser(u: User): string {
    switch (u.role) {
        case 'admin':
            return `Admin with permissions: ${u.permissions.join(', ')}`;
        case 'user':
            return `Registered user with email: ${u.email}`;
        case 'guest':
            return 'Guest user with limited access';
        default:
            return 'Unknown user';
    }
}

// Intersection example: when we need both TestData and Metadata
type TestData = { id: string; payload: unknown };
type Metadata = { createdAt: string; createdBy: string };

export type TestRecord = TestData & Metadata; // intersection: must satisfy both

export function printRecord(r: TestRecord): void {
    console.log(`Record ${r.id} created at ${r.createdAt} by ${r.createdBy}`);
    console.log('Payload:', r.payload);
}

// Example usage
if (require.main === module) {
    const admin: User = { role: 'admin', permissions: ['read', 'write'] };
    console.log(describeUser(admin));

    const rec: TestRecord = { id: 't1', payload: { a: 1 }, createdAt: new Date().toISOString(), createdBy: 'tester' };
    printRecord(rec);
}
