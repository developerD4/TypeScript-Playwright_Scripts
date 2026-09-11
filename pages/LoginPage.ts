// import { Page, Locator } from '@playwright/test';

// export class LoginPage {

//   private readonly usernameInput: Locator; //class properties
//   private readonly passwordInput: Locator;
//   private readonly loginButton: Locator;

//   constructor(private readonly page: Page) {

//     this.usernameInput = page.getByPlaceholder('Username');

//     this.passwordInput = page.getByPlaceholder('Password');

//     this.loginButton = page.getByRole('button', { name: 'Login' });
//   }

//   async open() {
//     await this.page.goto('/web/index.php/auth/login');
//   }

//   async login(username: string, password: string) {

//     await this.usernameInput.fill(username);

//     await this.passwordInput.fill(password);

//     await this.loginButton.click();
//   }
// }
// Page Object: A class that keeps a page's locators and actions in one place.
// Constructor: Used to receive and initialize the Page object before using it.
// Page Object best practice: Keep the Page, locators, and page actions together in one class.
// readonly: Allows a value to be assigned once and not reassigned later.
// "this" refers to the current class object and is used to access its properties and methods.

import { Page, Locator } from '@playwright/test';
import { baseUrl } from '../config/environment';
import { CommonActions } from '../wrapper/safeActions';
import { logger } from '../logger/logger';
export class LoginPage {
  private readonly actions = new CommonActions();
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  constructor(private readonly page: Page) {
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }
  async open(): Promise<void> {
    logger.info('Opening OrangeHRM login page');
    await this.page.goto(baseUrl);
  }
  async login(username: string, password: string): Promise<void> {
    await this.actions.fillText(this.usernameInput, username, 'Username field');
    await this.actions.fillText(this.passwordInput, password, 'Password field');
    await this.actions.clickElement(this.loginButton, 'Login button');
  }
}