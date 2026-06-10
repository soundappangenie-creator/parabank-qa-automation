const { BaseApiClient } = require('../../base/BaseApiClient');

class ParaBankApiClient extends BaseApiClient {
    async initializeDB() {
        return this.post('/initializeDB');
    }

    async login(username, password) {
        return this.get(
            `/login/${encodeURIComponent(username)}/${encodeURIComponent(password)}`
        );
    }

    async getAccounts(customerId) {
        return this.get(`/customers/${customerId}/accounts`);
    }

    async getAccount(accountId) {
        return this.get(`/accounts/${accountId}`);
    }

    async getAccountTransactions(accountId) {
        return this.get(`/accounts/${accountId}/transactions`);
    }

    async transfer(fromAccountId, toAccountId, amount) {
        const params = new URLSearchParams({
            fromAccountId: String(fromAccountId),
            toAccountId: String(toAccountId),
            amount: String(amount),
        });
        return this.post(`/transfer?${params.toString()}`);
    }

    async createAccount(customerId, newAccountType, fromAccountId) {
        const params = new URLSearchParams({
            customerId: String(customerId),
            newAccountType: String(newAccountType),
            fromAccountId: String(fromAccountId),
        });
        return this.post(`/createAccount?${params.toString()}`);
    }
}

module.exports = { ParaBankApiClient };
