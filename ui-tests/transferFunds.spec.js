const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { TransferFundsPage } = require('./pages/TransferFundsPage');
const { ParaBankApiClient } = require('../api-tests/pages/ParaBankApiClient');

const username = process.env.PARABANK_USERNAME || 'john';
const password = process.env.PARABANK_PASSWORD || 'demo';

test.describe('ParaBank Transfer Funds UI Tests', () => {

    // Reset the ParaBank demo DB before any test runs so john/demo exists.
    // Without this the demo site may have reset and login returns "Error!".
    test.beforeAll(async ({ request }) => {
        const api = new ParaBankApiClient(request);
        const res = await api.initializeDB();
        expect(res.status()).toBe(204); // 204 = seed restored successfully
    });

    /**
     * TC-001 — Positive
     * Verify a valid user can log in and navigate to the Transfer Funds page.
     * Assertions:
     *   - Post-login heading is "Accounts Overview"
     *   - Transfer Funds page URL contains /transfer.htm
     *   - Transfer Funds page heading is "Transfer Funds"
     */
    test('TC-001: valid user can login and open Transfer Funds page', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const transferFundsPage = new TransferFundsPage(page);

        await loginPage.goto();
        await loginPage.login(username, password);

        // Verify successful login — heading and URL
        await expect(page.locator('h1.title').first()).toHaveText('Accounts Overview');
        await expect(page).toHaveURL(/overview\.htm/);

        // Navigate to Transfer Funds and verify page
        await transferFundsPage.open();
        await expect(page).toHaveURL(/transfer\.htm/);
        await expect(page.locator('h1.title').first()).toHaveText('Transfer Funds');
    });

    /**
     * TC-002 — Positive
     * Verify a valid user can successfully transfer funds between two accounts.
     * Assertions:
     *   - Success heading "Transfer Complete!" is visible
     *   - Result contains "$100.00 has been transferred"
     *   - #showResult panel is visible (not hidden)
     */
    test('TC-002: valid user can transfer funds successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const transferFundsPage = new TransferFundsPage(page);

        await loginPage.goto();
        await loginPage.login(username, password);

        await transferFundsPage.open();
        await transferFundsPage.ensureTwoAccounts();
        await transferFundsPage.transfer('100');
        await transferFundsPage.expectTransferComplete('100');
    });

    /**
     * TC-004 — Negative
     * Verify that entering a non-numeric amount does not complete a transfer.
     * Assertions:
     *   - #showResult panel remains hidden
     *   - Page body does NOT contain a success message
     *   - The transfer form input is still visible (user stays on the form)
     */
    test('TC-004: transfer with non-numeric amount should not complete valid transfer', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const transferFundsPage = new TransferFundsPage(page);

        await loginPage.goto();
        await loginPage.login(username, password);

        await transferFundsPage.open();
        await transferFundsPage.transfer('abc');

        await transferFundsPage.expectTransferNotComplete();
    });
});