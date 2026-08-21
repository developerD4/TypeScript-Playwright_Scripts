// pages/CheckoutStepTwoPage.ts

import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutStepTwoPage extends BasePage {
  readonly finishButton: Locator = this.page.locator('[data-test="finish"]');
  readonly totalLabel: Locator = this.page.locator('[data-test="total-label"]');
  readonly subtotalLabel: Locator = this.page.locator('[data-test="subtotal-label"]');

  async getTotalText(): Promise<string> {
    return this.totalLabel.innerText();
  }

  async getSubtotalText(): Promise<string> {
    return this.subtotalLabel.innerText();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
