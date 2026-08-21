// pages/InventoryPage.ts

import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { HeaderComponent } from '../components/HeaderComponent';

export type SortOrder = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  readonly header: HeaderComponent;
  readonly productCards: Locator = this.page.locator('.inventory_item');
  readonly sortDropdown: Locator = this.page.locator('[data-test="product-sort-container"]');

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }

  private addToCartButton(productName: string): Locator {
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    return this.page.locator(`[data-test="add-to-cart-${slug}"]`);
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.addToCartButton(productName).click();
  }

  // The `SortOrder` type means TypeScript itself rejects a typo like
  // sortBy('low-to-high') at compile time — see
  // 02-strongly-typed-page-classes.spec.ts for more on this.
  async sortBy(order: SortOrder): Promise<void> {
    await this.sortDropdown.selectOption(order);
  }

  async getProductCount(): Promise<number> {
    return this.productCards.count();
  }

  async getProductNames(): Promise<string[]> {
    return this.productCards.locator('.inventory_item_name').allTextContents();
  }
}
