const { test, expect } = require('@playwright/test');
const { ParaBankApiClient } = require('./pages/ParaBankApiClient');

const transferAmount = 100;

const username = process.env.PARABANK_API_USERNAME || 'john';
const password = process.env.PARABANK_API_PASSWORD || 'demo';

test.describe('ParaBank API Tests', () => {

    let customerId;
    let fromAccountId;
    let toAccountId;
    test.beforeAll(async ({ request }) => {
        const api = new ParaBankApiClient(request);

        const resetRes = await api.initializeDB();
        expect(resetRes.status()).toBe(204);

        const loginRes = await api.login(username, password);
        expect(loginRes.status()).toBe(200);
        const customer = await loginRes.json();
        customerId = customer.id;

        const accountsRes = await api.getAccounts(customerId);
        expect(accountsRes.status()).toBe(200);
        const accounts = await accountsRes.json();
        expect(accounts.length).toBeGreaterThanOrEqual(2);

        fromAccountId = accounts[0].id;
        toAccountId = accounts[1].id;
    });
    test('TC-API-01: transfer funds updates source and destination balances', async ({ request }) => {
        const api = new ParaBankApiClient(request);

        const fromBeforeRes = await api.getAccount(fromAccountId);
        const toBeforeRes = await api.getAccount(toAccountId);
        expect(fromBeforeRes.status()).toBe(200);
        expect(toBeforeRes.status()).toBe(200);

        const fromBefore = await fromBeforeRes.json();
        const toBefore = await toBeforeRes.json();

        const response = await api.transfer(fromAccountId, toAccountId, transferAmount);
        expect(response.status()).toBe(200);

        const body = await response.text();
        expect(body).toContain('Successfully transferred');

        const fromAfterRes = await api.getAccount(fromAccountId);
        const toAfterRes = await api.getAccount(toAccountId);
        expect(fromAfterRes.status()).toBe(200);
        expect(toAfterRes.status()).toBe(200);

        const fromAfter = await fromAfterRes.json();
        const toAfter = await toAfterRes.json();
        expect(fromAfter.balance).toBeCloseTo(fromBefore.balance - transferAmount, 2);
        expect(toAfter.balance).toBeCloseTo(toBefore.balance + transferAmount, 2);
    });

    test('TC-API-02: transfer from non-existent account returns 4xx error', async ({ request }) => {
        const api = new ParaBankApiClient(request);

        const fakeAccountId = 999999999;
        const response = await api.transfer(fakeAccountId, toAccountId, 50);

        expect(response.status()).toBeGreaterThanOrEqual(400);
        expect(response.status()).toBeLessThan(500);
    });

    test('TC-API-03: account transactions returns 200 with valid schema on every record', async ({ request }) => {
        const api = new ParaBankApiClient(request);

        const response = await api.getAccountTransactions(fromAccountId);
        expect(response.status()).toBe(200);

        const transactions = await response.json();
        expect(Array.isArray(transactions)).toBe(true);
        expect(transactions.length).toBeGreaterThan(0);

        for (const tx of transactions) {
            expect(tx).toHaveProperty('id');
            expect(tx).toHaveProperty('type');
            expect(tx).toHaveProperty('amount');
            expect(tx).toHaveProperty('date');

            expect(typeof tx.id).toBe('number');
            expect(typeof tx.type).toBe('string');
            expect(typeof tx.amount).toBe('number');
            expect(['number', 'string'].includes(typeof tx.date)).toBe(true);
        }
    });
});
