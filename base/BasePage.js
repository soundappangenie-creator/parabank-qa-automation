class BasePage {
    constructor(page) {
        this.page = page;
        this.baseUrl = process.env.BASE_URL || 'https://parabank.parasoft.com/parabank';
    }

    async navigateTo(path = '') {
        await this.page.goto(`${this.baseUrl}${path}`);
    }

    async waitForVisible(locator, timeout = 10_000) {
        await locator.waitFor({ state: 'visible', timeout });
    }

    async waitForHidden(locator, timeout = 10_000) {
        await locator.waitFor({ state: 'hidden', timeout });
    }

    async waitForUrl(urlPattern) {
        await this.page.waitForURL(urlPattern);
    }

    async getCurrentUrl() {
        return this.page.url();
    }

    async getTitle() {
        return this.page.title();
    }
}

module.exports = { BasePage };
