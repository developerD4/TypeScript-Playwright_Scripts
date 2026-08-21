// pages/CheckoutCompletePage.ts

import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  readonly completeHeader: Locator = this.page.locator('[data-test="complete-header"]');
  readonly backHomeButton: Locator = this.page.locator('[data-test="back-to-products"]');

  async getConfirmationText(): Promise<string> {
    return this.completeHeader.innerText();
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
