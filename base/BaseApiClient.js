class BaseApiClient {
    constructor(request) {
        this.request = request;
        this.baseUrl = process.env.API_BASE_URL ||
            'https://parabank.parasoft.com/parabank/services/bank';
        this.defaultHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
    }

    async get(path, options = {}) {
        return this.request.get(`${this.baseUrl}${path}`, {
            headers: this.defaultHeaders,
            ...options,
        });
    }

    async post(path, options = {}) {
        return this.request.post(`${this.baseUrl}${path}`, {
            headers: this.defaultHeaders,
            ...options,
        });
    }

    async expectJson(response, expectedStatus = 200) {
        if (response.status() !== expectedStatus) {
            const body = await response.text();
            throw new Error(
                `Expected HTTP ${expectedStatus} but got ${response.status()}.\nBody: ${body}`
            );
        }
        return response.json();
    }
}

module.exports = { BaseApiClient };
