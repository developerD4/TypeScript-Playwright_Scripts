// framework/utils/randomDataGenerator.ts
//
// Generates throwaway random test data without pulling in a library like
// @faker-js/faker. Good enough for form-filling and uniqueness needs in
// most UI/API tests; swap in faker if you need more realistic-looking data.

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFromArray<T>(items: readonly T[]): T {
  if (items.length === 0) throw new Error('randomFromArray() received an empty array');
  return items[randomInt(0, items.length - 1)];
}

/** A short unique-enough suffix for building unique usernames/emails per test run. */
export function randomId(length = 8): string {
  return Math.random().toString(36).slice(2, 2 + length);
}

export function randomEmail(): string {
  return `qa.user.${randomId()}@example.com`;
}

export function randomUsername(): string {
  return `user_${randomId(6)}`;
}

export function randomFullName(): { firstName: string; lastName: string } {
  const firstNames = ['Alex', 'Priya', 'Jordan', 'Sam', 'Taylor', 'Morgan'] as const;
  const lastNames = ['Smith', 'Nguyen', 'Patel', 'Garcia', 'Kim', 'Brown'] as const;
  return {
    firstName: randomFromArray(firstNames),
    lastName: randomFromArray(lastNames),
  };
}

export function randomPassword(length = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[randomInt(0, chars.length - 1)];
  }
  return password;
}
