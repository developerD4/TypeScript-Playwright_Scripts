# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pim.spec.ts >> Orange HRM demo automation testing >> Find employee section and open it
- Location: tests\pim.spec.ts:26:9

# Error details

```
Test timeout of 50000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: Test timeout of 50000ms exceeded.
Call log:
  - navigating to "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login", waiting until "load"

```

# Test source

```ts
  1  | // import { Page, Locator } from '@playwright/test';
  2  | 
  3  | // export class LoginPage {
  4  | 
  5  | //   private readonly usernameInput: Locator; //class properties
  6  | //   private readonly passwordInput: Locator;
  7  | //   private readonly loginButton: Locator;
  8  | 
  9  | //   constructor(private readonly page: Page) {
  10 | 
  11 | //     this.usernameInput = page.getByPlaceholder('Username');
  12 | 
  13 | //     this.passwordInput = page.getByPlaceholder('Password');
  14 | 
  15 | //     this.loginButton = page.getByRole('button', { name: 'Login' });
  16 | //   }
  17 | 
  18 | //   async open() {
  19 | //     await this.page.goto('/web/index.php/auth/login');
  20 | //   }
  21 | 
  22 | //   async login(username: string, password: string) {
  23 | 
  24 | //     await this.usernameInput.fill(username);
  25 | 
  26 | //     await this.passwordInput.fill(password);
  27 | 
  28 | //     await this.loginButton.click();
  29 | //   }
  30 | // }
  31 | // Page Object: A class that keeps a page's locators and actions in one place.
  32 | // Constructor: Used to receive and initialize the Page object before using it.
  33 | // Page Object best practice: Keep the Page, locators, and page actions together in one class.
  34 | // readonly: Allows a value to be assigned once and not reassigned later.
  35 | // "this" refers to the current class object and is used to access its properties and methods.
  36 | 
  37 | import { Page, Locator } from '@playwright/test';
  38 | import { baseUrl } from '../config/environment';
  39 | import { CommonActions } from '../wrapper/safeActions';
  40 | import { logger } from '../logger/logger';
  41 | export class LoginPage {
  42 |   private readonly actions = new CommonActions();
  43 |   private readonly usernameInput: Locator;
  44 |   private readonly passwordInput: Locator;
  45 |   private readonly loginButton: Locator;
  46 |   constructor(private readonly page: Page) {
  47 |     this.usernameInput = page.getByPlaceholder('Username');
  48 |     this.passwordInput = page.getByPlaceholder('Password');
  49 |     this.loginButton = page.getByRole('button', { name: 'Login' });
  50 |   }
  51 |   async open(): Promise<void> {
  52 |     logger.info('Opening OrangeHRM login page');
> 53 |     await this.page.goto(baseUrl);
     |                     ^ Error: page.goto: Test timeout of 50000ms exceeded.
  54 |   }
  55 |   async login(username: string, password: string): Promise<void> {
  56 |     await this.actions.fillText(this.usernameInput, username, 'Username field');
  57 |     await this.actions.fillText(this.passwordInput, password, 'Password field');
  58 |     await this.actions.clickElement(this.loginButton, 'Login button');
  59 |   }
  60 | }
```