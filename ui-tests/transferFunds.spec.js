const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { TransferFundsPage } = require('./pages/TransferFundsPage');
const { ParaBankApiClient } = require('../api-tests/pages/ParaBankApiClient');

const username = process.env.PARABANK_USERNAME || 'john';
const password = process.env.PARABANK_PASSWORD || 'demo';

test.describe('ParaBank Transfer Funds UI Tests', () => {

    test.beforeAll(async ({ request }) => {
        const api = new ParaBankApiClient(request);
        const res = await api.initializeDB();
        expect(res.status()).toBe(204);
    });

    test('TC-001: valid user can login and open Transfer Funds page', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const transferFundsPage = new TransferFundsPage(page);

        await loginPage.goto();
        await loginPage.login(username, password);

        await expect(page.locator('h1.title').first()).toHaveText('Accounts Overview');
        await expect(page).toHaveURL(/overview\.htm/);

        await transferFundsPage.open();
        await expect(page).toHaveURL(/transfer\.htm/);
        await expect(page.locator('h1.title').first()).toHaveText('Transfer Funds');
    });

    test('TC-002: valid user can transfer funds successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const transferFundsPage = new TransferFundsPage(page);

        await loginPage.goto();
        await loginPage.login(username, password);

        await transferFundsPage.open();
        await transferFundsPage.transfer('150');
        await transferFundsPage.expectTransferComplete('150');
    });

    test('TC-004: non-numeric amount does not complete transfer', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const transferFundsPage = new TransferFundsPage(page);

        await loginPage.goto();
        await loginPage.login(username, password);

        await transferFundsPage.open();
        await transferFundsPage.transfer('abcd');

        await transferFundsPage.expectTransferNotComplete();
    });
});
