// components/HeaderComponent.ts
//
// TOPIC 4: Component-based POM for reusable UI widgets
//
// SauceDemo's header (cart icon, burger menu, logout link) appears
// unchanged on the inventory, cart, and checkout pages. Instead of
// re-declaring "the cart icon locator" inside InventoryPage AND CartPage
// AND every checkout page, it's modeled ONCE here as its own small
// component class, and each page that has this header just holds an
// instance of it — see `header` in InventoryPage.ts and CartPage.ts.
//
// This is the same idea as a Page Object, just scoped to a piece of UI
// that's smaller than a whole page.

import type { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  /** Returns 0 if the cart is empty (the badge element doesn't even render then). */
  async getCartCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) return 0;
    return Number(await this.cartBadge.innerText());
  }

  async logout(): Promise<void> {
    await this.burgerMenuButton.click();
    await this.logoutLink.click();
  }
}
