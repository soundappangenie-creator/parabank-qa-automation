const { BaseApiClient } = require('../../base/BaseApiClient');

/**
 * ParaBankApiClient — API client for the ParaBank REST banking API.
 * Extends BaseApiClient which provides baseUrl, defaultHeaders, get(), post(), and expectJson().
 */
class ParaBankApiClient extends BaseApiClient {
    constructor(request) {
        super(request);
    }

    /**
     * Reset the ParaBank database to its default seed state.
     * Restores default accounts (john/demo, etc.) after a site reset.
     * POST /initializeDB  →  204 No Content
     */
    async initializeDB() {
        return this.post('/initializeDB');
    }

    /**
     * Login with username and password.
     * GET /login/{username}/{password}  →  200 + customer object
     */
    async login(username, password) {
        return this.get(
            `/login/${encodeURIComponent(username)}/${encodeURIComponent(password)}`
        );
    }

    /**
     * Get all accounts for a given customer ID.
     * GET /customers/{customerId}/accounts  →  200 + account array
     * @param {number|string} customerId
     */
    async getAccounts(customerId) {
        return this.get(`/customers/${customerId}/accounts`);
    }

    /**
     * Get details of a single account.
     * GET /accounts/{accountId}  →  200 + account object
     * @param {number|string} accountId
     */
    async getAccount(accountId) {
        return this.get(`/accounts/${accountId}`);
    }

    /**
     * Get all transactions for a given account.
     * GET /accounts/{accountId}/transactions  →  200 + transaction array
     * @param {number|string} accountId
     */
    async getAccountTransactions(accountId) {
        return this.get(`/accounts/${accountId}/transactions`);
    }

    /**
     * Transfer funds between two accounts.
     * POST /transfer?fromAccountId=&toAccountId=&amount=  →  200
     * @param {number|string} fromAccountId
     * @param {number|string} toAccountId
     * @param {number} amount
     */
    async transfer(fromAccountId, toAccountId, amount) {
        const params = new URLSearchParams({
            fromAccountId: String(fromAccountId),
            toAccountId:   String(toAccountId),
            amount:        String(amount),
        });
        return this.post(`/transfer?${params.toString()}`);
    }

    /**
     * Create a new account for a customer.
     * POST /createAccount?customerId=&newAccountType=&fromAccountId=  →  200 + account object
     * @param {number|string} customerId
     * @param {number} newAccountType  0 = CHECKING, 1 = SAVINGS
     * @param {number|string} fromAccountId  source account for the minimum deposit
     */
    async createAccount(customerId, newAccountType, fromAccountId) {
        const params = new URLSearchParams({
            customerId:     String(customerId),
            newAccountType: String(newAccountType),
            fromAccountId:  String(fromAccountId),
        });
        return this.post(`/createAccount?${params.toString()}`);
    }
}

module.exports = { ParaBankApiClient };
