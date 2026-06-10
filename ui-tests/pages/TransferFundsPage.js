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

    async open() {
        await this.page.getByRole('link', { name: 'Transfer Funds' }).click();
        await this.waitForUrl('**/transfer.htm');
        await this.page.waitForFunction(() => {
            const from = document.querySelector('select#fromAccountId');
            const to = document.querySelector('select#toAccountId');
            return from?.options.length > 0 && to?.options.length > 0;
        });
    }

    async transfer(amount) {
        await this.amountInput.fill(amount);

        const fromOptions = await this.fromAccountSelect.locator('option').evaluateAll((options) =>
            options
                .map((option) => option.value)
                .filter((value) => value)
        );

        if (fromOptions.length < 2) {
            throw new Error('Need at least two accounts to run the transfer test.');
        }

        await this.fromAccountSelect.selectOption(fromOptions[0]);
        await this.toAccountSelect.selectOption(fromOptions[1]);

        await this.transferButton.click();
    }

    async expectTransferComplete(amount) {
        await this.waitForVisible(this.showResult, 15_000);
        const formatted = `$${parseFloat(amount).toFixed(2)} has been transferred`;
        await expect(this.showResult.locator('h1.title')).toHaveText('Transfer Complete!');
        await expect(this.showResult).toContainText(formatted);
    }

    async expectTransferNotComplete() {
        await expect(this.showResult).toBeHidden();
        await expect(this.page).toHaveURL(/transfer\.htm/);
        await expect(this.transferForm).toBeVisible();
    }
}

module.exports = { TransferFundsPage };
