// framework/factories/userFactory.ts
//
// Test data builder/factory pattern: instead of scattering hand-written
// literal objects (`{ name: 'John', email: 'john@test.com', ... }`) across
// many spec files, build them through one place. This gives you:
//   - sensible random defaults, so a test only has to override what it
//     actually cares about
//   - a single spot to update when the required shape of "a user" changes
//   - guaranteed-unique values (email/username) across parallel test runs

import { randomEmail, randomFullName, randomPassword, randomUsername } from '../utils/randomDataGenerator';

export interface TestUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

/** Builder pattern: chain .withX() calls, then .build() when ready. */
export class UserBuilder {
  private user: TestUser;

  constructor() {
    const { firstName, lastName } = randomFullName();
    // Sensible random defaults for every field up front, so callers only
    // need to override the ones relevant to their specific test.
    this.user = {
      firstName,
      lastName,
      username: randomUsername(),
      email: randomEmail(),
      password: randomPassword(),
    };
  }

  withFirstName(firstName: string): this {
    this.user.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): this {
    this.user.lastName = lastName;
    return this;
  }

  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }

  withPassword(password: string): this {
    this.user.password = password;
    return this;
  }

  build(): TestUser {
    // Return a copy so mutating the built object never affects the
    // builder's internal state if it's reused.
    return { ...this.user };
  }
}

/** Convenience factory function for the common case of "just give me a user". */
export function createRandomUser(overrides: Partial<TestUser> = {}): TestUser {
  const builder = new UserBuilder();
  return { ...builder.build(), ...overrides };
}
