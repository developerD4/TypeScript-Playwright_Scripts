// pages/CartPage.ts

import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from '../components/HeaderComponent';

export class CartPage extends BasePage {
  readonly header: HeaderComponent;
  readonly cartItems: Locator = this.page.locator('.cart_item');
  readonly checkoutButton: Locator = this.page.locator('[data-test="checkout"]');

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  async getItemNames(): Promise<string[]> {
    return this.cartItems.locator('.inventory_item_name').allTextContents();
  }

  async removeItem(productName: string): Promise<void> {
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    await this.page.locator(`[data-test="remove-${slug}"]`).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
