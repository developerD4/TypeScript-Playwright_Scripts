// pages/LoginPage.ts
//
// TOPIC 1 & 2: locators/actions live here, not in the test file; every
// property and method has an explicit TypeScript type.

import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator = this.page.locator('#user-name');
  readonly passwordInput: Locator = this.page.locator('#password');
  readonly loginButton: Locator = this.page.locator('#login-button');
  readonly errorMessage: Locator = this.page.locator('[data-test="error"]');

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Deliberately returns the raw text, not a boolean or an assertion — see
   * 08-avoiding-anti-patterns.spec.ts for why page objects should hand data
   * back to the test rather than deciding pass/fail themselves.
   */
  async getErrorText(): Promise<string> {
    return this.errorMessage.innerText();
  }
}
