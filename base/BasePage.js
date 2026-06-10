/**
 * BasePage — base class for all UI Page Object classes.
 *
 * Centralises shared configuration (base URL), common navigation helpers,
 * and explicit wait utilities so individual page classes stay focused on
 * their own selectors and actions.
 */
class BasePage {
    /**
     * @param {import('@playwright/test').Page} page - Playwright Page instance
     */
    constructor(page) {
        this.page = page;
        this.baseUrl = process.env.BASE_URL || 'https://parabank.parasoft.com/parabank';
    }

    /**
     * Navigate to a path relative to the application base URL.
     * @param {string} path - e.g. '/index.htm'
     */
    async navigateTo(path = '') {
        await this.page.goto(`${this.baseUrl}${path}`);
    }

    /**
     * Wait for a locator to become visible.
     * @param {import('@playwright/test').Locator} locator
     * @param {number} timeout - milliseconds (default 10 s)
     */
    async waitForVisible(locator, timeout = 10_000) {
        await locator.waitFor({ state: 'visible', timeout });
    }

    /**
     * Wait for a locator to become hidden.
     * @param {import('@playwright/test').Locator} locator
     * @param {number} timeout - milliseconds (default 10 s)
     */
    async waitForHidden(locator, timeout = 10_000) {
        await locator.waitFor({ state: 'hidden', timeout });
    }

    /**
     * Wait for the page URL to match a pattern.
     * @param {string|RegExp} urlPattern
     */
    async waitForUrl(urlPattern) {
        await this.page.waitForURL(urlPattern);
    }

    /**
     * Get the current page URL.
     * @returns {Promise<string>}
     */
    async getCurrentUrl() {
        return this.page.url();
    }

    /**
     * Get the current page <title>.
     * @returns {Promise<string>}
     */
    async getTitle() {
        return this.page.title();
    }
}

module.exports = { BasePage };
