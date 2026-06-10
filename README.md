# ParaBank QA Automation Assessment

This repo contains a small set of automated checks for ParaBank, a demo banking app.
I used ParaBank because the flows are easy to understand and it gives me login, transfer, and API scenarios to work with in one place.

## Framework and language

- JavaScript
- Playwright for UI automation
- Playwright `APIRequestContext` for API checks
- `@playwright/test` as the test runner
- Page Object Model for UI structure

## Project structure

```
parabank-qa-automation-assessment/
├── ui-tests/
│   ├── pages/
│   │   ├── LoginPage.js
│   │   └── TransferFundsPage.js
│   └── transferFunds.spec.js
├── api-tests/
│   └── parabank-api.spec.js
├── test-cases/
│   └── manual-test-cases.md
├── playwright.config.js
├── package.json
└── README.md
```

## Setup

- Node.js 18 or later
- npm 9 or later

```bash
npm install
npx playwright install chromium
```

## How to run

Run everything:

```bash
npx playwright test
```

Run only UI tests:

```bash
npx playwright test ui-tests/
```

Run only API tests:

```bash
npx playwright test api-tests/
```

Run UI tests in headed mode:

```bash
npx playwright test ui-tests/transferFunds.spec.js --headed
```

Open the HTML report:

```bash
npx playwright show-report
```

Optional environment variables:

```bash
PARABANK_USERNAME=myuser PARABANK_PASSWORD=mypassword npx playwright test
```

## UI coverage

- TC-001: valid login and open Transfer Funds page
- TC-002: valid transfer between accounts
- TC-004: non-numeric amount should not complete a transfer

TC-003 is kept in the manual cases.

## Assumptions and limitations

- The project uses the public ParaBank demo site by default.
- UI login tests need valid ParaBank credentials if you want to run them against a real account.
- The API tests cover the transfer and transaction flows that matter for this assessment.
- TC-003 stays manual because it is a negative validation case and is easier to explain there.
