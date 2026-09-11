import { Page, Locator } from '@playwright/test';
export class PimPage {
    private readonly menuItem: Locator;
    private readonly empText: Locator;
    private readonly admin: Locator;

    //page.getByRole('link', { name: 'Admin' });

    constructor(private readonly page: Page) {
        this.menuItem = page.locator('.oxd-main-menu-item').filter({ hasText: 'PIM' })
        this.empText = page.getByText('Employee Information', { exact: true })
        this.admin = page.getByRole('link', { name: 'Admin' });
    }
    async pimMenu() {
        await this.menuItem.click();
    }
    getPimMenu() {
        return this.menuItem;
    }
    getempInfo(): Locator {
        return this.empText;
    }
}