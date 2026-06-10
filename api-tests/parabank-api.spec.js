const { test, expect } = require('@playwright/test');
const { ParaBankApiClient } = require('./pages/ParaBankApiClient');

// Credentials for the pre-seeded ParaBank demo account.
// Override at runtime via environment variables if needed.
const username = process.env.PARABANK_API_USERNAME || 'john';
const password = process.env.PARABANK_API_PASSWORD || 'demo';

test.describe('ParaBank API Tests', () => {

    // Shared state populated in beforeAll and reused across tests.
    let customerId;
    let fromAccountId;
    let toAccountId;

    // ─── Setup ────────────────────────────────────────────────────
    // 1. Reset the DB so john/demo and their seed accounts exist.
    // 2. Login once to capture customerId and account IDs for reuse.
    // ─────────────────────────────────────────────────────────────
    test.beforeAll(async ({ request }) => {
        const api = new ParaBankApiClient(request);

        // Restore seed data (204 = success)
        const resetRes = await api.initializeDB();
        expect(resetRes.status()).toBe(204);

        // Authenticate and capture customer id
        const loginRes = await api.login(username, password);
        expect(loginRes.status()).toBe(200);
        const customer = await loginRes.json();
        customerId = customer.id;

        // Fetch accounts and capture two IDs for transfer tests
        const accountsRes = await api.getAccounts(customerId);
        expect(accountsRes.status()).toBe(200);
        const accounts = await accountsRes.json();
        expect(accounts.length).toBeGreaterThanOrEqual(2);

        fromAccountId = accounts[0].id;
        toAccountId   = accounts[1].id;
    });

    // ─────────────────────────────────────────────────────────────
    // TC-API-01 | Positive — Transfer Funds
    // A valid transfer between two owned accounts must return 200
    // and a non-empty confirmation in the response body.
    // Endpoint: POST /transfer?fromAccountId=&toAccountId=&amount=
    // ─────────────────────────────────────────────────────────────
    test('TC-API-01: transfer funds between accounts returns 200 with confirmation', async ({ request }) => {
        const api = new ParaBankApiClient(request);

        const response = await api.transfer(fromAccountId, toAccountId, 100);

        // Status validation
        expect(response.status()).toBe(200);

        // Response body must confirm the operation (non-empty)
        const body = await response.text();
        expect(body).toBeTruthy();
    });

    // ─────────────────────────────────────────────────────────────
    // TC-API-02 | Negative — Transfer from a non-existent account
    // Supplying an account ID that does not exist should cause the
    // server to reject the request with a 4xx error.
    // Endpoint: POST /transfer?fromAccountId=&toAccountId=&amount=
    // ─────────────────────────────────────────────────────────────
    test('TC-API-02: transfer from non-existent account returns 4xx error', async ({ request }) => {
        const api = new ParaBankApiClient(request);

        const fakeAccountId = 999999999; // guaranteed not to exist
        const response = await api.transfer(fakeAccountId, toAccountId, 50);

        // Must be a client-error — not a 200 or silent pass-through
        expect(response.status()).toBeGreaterThanOrEqual(400);
        expect(response.status()).toBeLessThan(500);
    });

    // ─────────────────────────────────────────────────────────────
    // TC-API-03 | Positive + Schema validation — Account Transactions
    // After a transfer, the transactions endpoint must return a
    // non-empty array where every record matches the expected schema:
    //   id: number | type: string | amount: number | date: number|string
    // Endpoint: GET /accounts/{accountId}/transactions
    // ─────────────────────────────────────────────────────────────
    test('TC-API-03: account transactions returns 200 with valid schema on every record', async ({ request }) => {
        const api = new ParaBankApiClient(request);

        const response = await api.getAccountTransactions(fromAccountId);

        // Status validation
        expect(response.status()).toBe(200);

        const transactions = await response.json();

        // Must be a non-empty array (the transfer in TC-API-01 guarantees this)
        expect(Array.isArray(transactions)).toBe(true);
        expect(transactions.length).toBeGreaterThan(0);

        // Field-type (schema) validation on every transaction record
        for (const tx of transactions) {
            // Field presence
            expect(tx).toHaveProperty('id');
            expect(tx).toHaveProperty('type');
            expect(tx).toHaveProperty('amount');
            expect(tx).toHaveProperty('date');

            // Field type checks
            expect(typeof tx.id).toBe('number');      // transaction id is numeric
            expect(typeof tx.type).toBe('string');    // type is a label e.g. "Debit"
            expect(typeof tx.amount).toBe('number');  // amount is numeric
            // date can be epoch ms (number) or ISO string depending on server version
            expect(['number', 'string'].includes(typeof tx.date)).toBe(true);
        }
    });
});