const { expect } = require('@playwright/test');
const { BasePage } = require('../../base/BasePage');

class TransferFundsPage extends BasePage {
    constructor(page) {
        super(page);
        this.amountInput = page.locator('input#amount');
        this.fromAccountSelect = page.locator('select#fromAccountId');
        this.toAccountSelect = page.locator('select#toAccountId');
        this.transferButton = page.locator('input[type="submit"]');
        this.showResult = page.locator('#showResult');
        this.transferForm = page.locator('#transferForm');
    }

    /**
     * Navigate to the Transfer Funds page and wait for account dropdowns to be populated.
     */
    async open() {
        await this.page.getByRole('link', { name: 'Transfer Funds' }).click();
        await this.waitForUrl('**/transfer.htm');
        // Wait for the page's AJAX to populate the account dropdowns
        await this.page.waitForFunction(() => {
            const sel = document.querySelector('select#fromAccountId');
            return sel && sel.options.length > 0;
        });
    }

    /**
     * Ensures at least two accounts exist (required for a valid transfer).
     * Opens a new Savings account via the UI if only one account is found.
     */
    async ensureTwoAccounts() {
        const fromOptions = await this.fromAccountSelect.locator('option').all();
        if (fromOptions.length < 2) {
            await this.page.getByRole('link', { name: 'Open New Account' }).click();
            await this.waitForUrl('**/openaccount.htm');

            await this.page.locator('select#type').selectOption('1');
            await this.page.waitForFunction(() => {
                const sel = document.querySelector('select#fromAccountId');
                return sel && sel.options.length > 0;
            });

            await this.page.locator('input[value="Open New Account"]').click();
            await this.waitForVisible(this.page.locator('#openAccountResult'));

            await this.page.getByRole('link', { name: 'Transfer Funds' }).click();
            await this.waitForUrl('**/transfer.htm');
            await this.page.waitForFunction(() => {
                const sel = document.querySelector('select#fromAccountId');
                return sel && sel.options.length >= 2;
            });
        }
    }

    /**
     * Fills in the transfer amount and selects distinct from/to accounts before submitting.
     * @param {string} amount
     */
    async transfer(amount) {
        await this.amountInput.fill(amount);

        const fromOptions = await this.fromAccountSelect.locator('option').all();
        const toOptions = await this.toAccountSelect.locator('option').all();

        if (fromOptions.length >= 2 && toOptions.length >= 2) {
            const fromValue = await fromOptions[0].getAttribute('value');
            const toValue = await toOptions[1].getAttribute('value');
            await this.fromAccountSelect.selectOption(fromValue);
            await this.toAccountSelect.selectOption(toValue);
        }

        await this.transferButton.click();
    }

    /**
     * Asserts that a transfer completed successfully.
     * @param {string} amount
     */
    async expectTransferComplete(amount) {
        await this.waitForVisible(this.showResult, 15_000);
        const formatted = `$${parseFloat(amount).toFixed(2)} has been transferred`;
        await expect(this.showResult.locator('h1.title')).toHaveText('Transfer Complete!');
        await expect(this.showResult).toContainText(formatted);
    }

    /**
     * Asserts that a transfer did NOT complete (negative scenario).
     * Verifies: result panel stays hidden, URL unchanged, form still visible.
     */
    async expectTransferNotComplete() {
        await expect(this.showResult).toBeHidden();
        await expect(this.page).toHaveURL(/transfer\.htm/);
        await expect(this.transferForm).toBeVisible();
    }
}

module.exports = { TransferFundsPage };
