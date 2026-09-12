// utils/fakerData.ts

import { faker } from '@faker-js/faker';

export function generateUniqueEmail(): string {

    return faker.internet.email();
}

//usage
// const email = generateUniqueEmail();
// This is the important concept because parallel tests must not accidentally modify the same record. Playwright also provides isolated test fixtures and supports worker-scoped fixtures when sharing data safely is actually required.