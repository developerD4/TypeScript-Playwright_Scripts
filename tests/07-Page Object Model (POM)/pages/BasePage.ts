// pages/BasePage.ts
//
// TOPIC 3: Building a Base Page class with common reusable methods
//
// Every page object below (LoginPage, InventoryPage, ...) extends this
// class instead of repeating the same navigate/waitForLoad logic in each
// one. If SauceDemo's URL or a common wait strategy ever changes, it's a
// one-line fix here instead of an edit in every page class.

import type { Page } from '@playwright/test';

const BASE_URL = 'https://www.saucedemo.com';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigates to a path relative to SauceDemo's base URL, e.g. goto('/cart.html'). */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(`${BASE_URL}${path}`);
  }

  /** Waits for the page to finish its initial load — call after an action that navigates. */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }
}
