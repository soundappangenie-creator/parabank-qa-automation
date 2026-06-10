# ParaBank QA Automation Assessment

This repository contains UI, API, and manual test coverage for ParaBank, a demo banking application. The focus is the Transfer Funds workflow because it exercises realistic banking concerns: authentication, source/destination account selection, amount validation, balance changes, and transaction history.

## Tech Stack

- JavaScript
- Playwright for UI automation
- Playwright `APIRequestContext` for API checks
- `@playwright/test` as the test runner
- Page Object Model for UI pages and API client objects

## Project Structure

```text
parabank-qa-automation-assessment/
|-- api-tests/
|   |-- pages/
|   |   `-- ParaBankApiClient.js
|   `-- parabank-api.spec.js
|-- base/
|   |-- BaseApiClient.js
|   `-- BasePage.js
|-- test-cases/
|   `-- manual-test-cases.md
|-- ui-tests/
|   |-- pages/
|   |   |-- LoginPage.js
|   |   `-- TransferFundsPage.js
|   `-- transferFunds.spec.js
|-- package.json
`-- playwright.config.js
```

## Setup

Prerequisites:

- Node.js 18 or later
- npm 9 or later

Install dependencies and browser binaries:

```bash
npm install
npx playwright install chromium
```

## How To Run

Run all tests:

```bash
npm test
```

Run only UI tests:

```bash
npm run test:ui
```

Run only API tests:

```bash
npm run test:api
```

Open the HTML report:

```bash
npm run report
```

Optional environment variables:

```bash
PARABANK_USERNAME=myuser PARABANK_PASSWORD=mypassword npm run test:ui
PARABANK_API_USERNAME=myuser PARABANK_API_PASSWORD=mypassword npm run test:api
```

## Automated Coverage

### UI

- `TC-001`: valid login and navigation to the Transfer Funds page.
- `TC-002`: valid transfer between two accounts with confirmation message assertions.
- `TC-004`: non-numeric amount does not complete a transfer and keeps the user on the form.

### API

- `TC-API-01`: valid transfer returns success and verifies both source and destination balances change by the transfer amount.
- `TC-API-02`: transfer from a non-existent account returns a 4xx error.
- `TC-API-03`: account transactions endpoint returns transaction records with expected schema.

## Manual Coverage

Manual scenarios are documented in `test-cases/manual-test-cases.md` for validation and access-control cases that are useful to describe even when the demo app behavior may vary.

## Assumptions And Limitations

- The public ParaBank demo site is used by default.
- Tests reset the ParaBank demo database before execution so the `john/demo` account exists.
- UI tests depend on the public demo site being available and responsive.
- Some negative validation behavior is kept manual because the demo app does not consistently expose field-level validation messages.
