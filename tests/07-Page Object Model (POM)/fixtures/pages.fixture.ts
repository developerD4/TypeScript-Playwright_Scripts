// fixtures/pages.fixture.ts
//
// TOPIC 5: Fixture-based POM injection using test.extend() instead of
// manual instantiation
//
// Without this file, every test that needs a LoginPage has to write
// `const loginPage = new LoginPage(page);` itself (see
// 01-pom-principles-separating-locators-actions.spec.ts for that manual
// style). Here, each page object is registered as a fixture ONCE, and any
// test that destructures e.g. `{ loginPage }` from its callback argument
// gets a ready-to-use instance automatically — no `new` needed in the test
// at all. Compare this file side-by-side with
// framework/fixtures/base-fixtures.ts from the Framework Development
// topic — same test.extend() pattern, applied to page objects instead of
// utilities.

import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

interface PageFixtures {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
}

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutStepOnePage: async ({ page }, use) => {
    await use(new CheckoutStepOnePage(page));
  },
  checkoutStepTwoPage: async ({ page }, use) => {
    await use(new CheckoutStepTwoPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
});

export { expect };
