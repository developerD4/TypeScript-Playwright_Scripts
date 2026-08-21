// pages/CheckoutStepOnePage.ts

import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutStepOnePage extends BasePage {
  readonly firstNameInput: Locator = this.page.locator('[data-test="firstName"]');
  readonly lastNameInput: Locator = this.page.locator('[data-test="lastName"]');
  readonly postalCodeInput: Locator = this.page.locator('[data-test="postalCode"]');
  readonly continueButton: Locator = this.page.locator('[data-test="continue"]');
  readonly errorMessage: Locator = this.page.locator('[data-test="error"]');

  // Taking one typed object instead of three loose string parameters means
  // callers can't accidentally swap the argument order (e.g. last name
  // where first name belongs) without TypeScript complaining.
  async fillInfo(info: CheckoutInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }
}
