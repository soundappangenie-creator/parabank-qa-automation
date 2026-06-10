/**
 * BaseApiClient — base class for all API client classes.
 *
 * Centralises the API base URL, default request headers, and convenience
 * HTTP methods (get / post) so individual API clients stay focused on
 * their own endpoint definitions and response parsing.
 */
class BaseApiClient {
    /**
     * @param {import('@playwright/test').APIRequestContext} request - Playwright request context
     */
    constructor(request) {
        this.request = request;
        this.baseUrl = process.env.API_BASE_URL ||
            'https://parabank.parasoft.com/parabank/services/bank';
        this.defaultHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
    }

    /**
     * Send a GET request to a path relative to the API base URL.
     * @param {string} path - e.g. '/login/john/demo'
     * @param {object} options - additional Playwright request options
     * @returns {Promise<import('@playwright/test').APIResponse>}
     */
    async get(path, options = {}) {
        return this.request.get(`${this.baseUrl}${path}`, {
            headers: this.defaultHeaders,
            ...options,
        });
    }

    /**
     * Send a POST request to a path relative to the API base URL.
     * @param {string} path - e.g. '/initializeDB'
     * @param {object} options - additional Playwright request options
     * @returns {Promise<import('@playwright/test').APIResponse>}
     */
    async post(path, options = {}) {
        return this.request.post(`${this.baseUrl}${path}`, {
            headers: this.defaultHeaders,
            ...options,
        });
    }

    /**
     * Assert a response has the expected HTTP status and return its parsed JSON body.
     * Throws a descriptive error on mismatch so failures are easy to diagnose.
     * @param {import('@playwright/test').APIResponse} response
     * @param {number} expectedStatus
     * @returns {Promise<object>}
     */
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
