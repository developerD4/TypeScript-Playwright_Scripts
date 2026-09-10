import type { Page } from '@playwright/test';
import { config } from '../config/env';
import { CommonActions } from '../core/safeActions';
import { logger } from '../logger/logger';

export class LoginPage {
  private readonly actions = new CommonActions();

  constructor(private readonly page: Page) {}

  private readonly usernameInput = this.page.locator('input[name="username"]');
  private readonly passwordInput = this.page.locator('input[name="password"]');
  private readonly loginButton = this.page.locator('button[type="submit"]');

  async open(): Promise<void> {
    logger.info('Opening OrangeHRM login page');
    await this.page.goto(config.baseURL);
  }

  async login(username: string, password: string): Promise<void> {
    await this.actions.fillText(this.usernameInput, username, 'Username field');
    await this.actions.fillText(this.passwordInput, password, 'Password field');
    await this.actions.clickElement(this.loginButton, 'Login button');
  }
}
