import { test, expect } from '@playwright/test';
import { fakeDb, User } from '../test-data/db/fakeDb';
//It's basically creating a small database utility/API object.
test.describe('Database Seeding and Cleanup', () => {
    let testUser: User;
    // SEED DATA BEFORE EACH TEST
    test.beforeEach(async () => {
        testUser = await fakeDb.createUser(
            'test_user',
            'test@example.com'
        );
    });
    // CLEANUP DATA AFTER EACH TEST
    test.afterEach(async () => {
        await fakeDb.deleteUser(testUser.id);
    });
    // TEST 1
    test('Verify seeded user', async () => {
        const user = await fakeDb.findUser(testUser.id);
        expect(user?.username).toBe('test_user');
        expect(user?.email).toBe('test@example.com');
    });
    // TEST 2
    test('Verify user exists before test', async () => {
        const user = await fakeDb.findUser(testUser.id);
        expect(user).toBeDefined();
    });
});