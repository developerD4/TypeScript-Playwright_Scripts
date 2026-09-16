import { Page, Locator } from '@playwright/test';

export class GuruLogin {

    private readonly registerUser: Locator; //class properties
    private readonly emailID: Locator;
    private readonly loginBtn: Locator;
    private readonly verifyAccessPage: Locator;
    private readonly userIDtrim: Locator;
    private readonly passwordTrim: Locator;

    constructor(private readonly page: Page) {

        this.registerUser = page.getByRole('link', { name: 'here' });
        this.verifyAccessPage = page.getByRole('heading', { name: 'Guru99 Bank' });
        this.emailID = page.locator('[name="emailid"]');

        this.loginBtn = page.locator('[name="btnLogin"]');

        this.userIDtrim = page.locator('//td[text()="User ID :"]/following-sibling::td');

        this.passwordTrim = page.locator('//td[text()="Password :"]/following-sibling::td');
    }
    async open() {
        await this.page.goto('https://demo.guru99.com/V4/');
    }
    async login() {
        await this.registerUser.click();
        const email = `user${Date.now()}@test.com`;
        await this.emailID.fill(email);

        await this.loginBtn.click();
    }
    async credentialTrim() {
        const userID = await this.userIDtrim.textContent();
        const pass = await this.passwordTrim.textContent();
        console.log(userID, pass);
        return { userID, pass }
    }
    getAccessPage() {
        return this.verifyAccessPage;
    }
}