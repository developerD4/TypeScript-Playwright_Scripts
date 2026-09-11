// db/fakeDb.ts
//
// A tiny in-memory stand-in for a real database client (e.g. `pg` for
// Postgres, `mysql2`, `mongodb`), so the seeding/cleanup PATTERN in
// 04-database-seeding-and-cleanup.spec.ts is runnable without needing an
// actual database server running. Every method below has a comment
// showing the real SQL you'd write against an actual database — swap this
// module for a real client in a real project; the pattern in the spec
// file stays the same either way.
//
// NOTE: this Map lives in ONE Node.js process's memory. A real database
// is a separate, shared server that every parallel test worker connects
// to — see 07-test-data-isolation-in-parallel-execution.spec.ts for why
// that distinction matters for how you seed/clean up against a real one.

import { randomUUID } from 'crypto';

export interface DbUser {
  id: string;
  username: string;
  email: string;
}

const usersTable = new Map<string, DbUser>();

export const fakeDb = {
  async seedUser(partial: Partial<Omit<DbUser, 'id'>> = {}): Promise<DbUser> {
    // Real equivalent:
    //   INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *;
    const user: DbUser = {
      id: randomUUID(),
      username: partial.username ?? `seed_user_${randomUUID().slice(0, 8)}`,
      email: partial.email ?? `${randomUUID().slice(0, 8)}@example.com`,
    };
    usersTable.set(user.id, user);
    return user;
  },

  async findUserById(id: string): Promise<DbUser | undefined> {
    // Real equivalent: SELECT * FROM users WHERE id = $1;
    return usersTable.get(id);
  },

  async deleteUser(id: string): Promise<void> {
    // Real equivalent: DELETE FROM users WHERE id = $1;
    usersTable.delete(id);
  },

  async countUsers(): Promise<number> {
    // Real equivalent: SELECT COUNT(*) FROM users;
    return usersTable.size;
  },

  async clearAllUsers(): Promise<void> {
    // Real equivalent: TRUNCATE TABLE users; (or DELETE FROM users;)
    usersTable.clear();
  },
};
