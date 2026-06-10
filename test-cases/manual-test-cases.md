# Manual Test Cases - ParaBank Transfer Funds

## TC-001
Test description: Valid login and open the Transfer Funds page.
Steps:
  1. Open the ParaBank application.
  2. Enter a valid username and password.
  3. Click `Log In`.
  4. Click `Transfer Funds` from the left menu.
Expected result: The customer lands on the Transfer Funds page and can see the amount field, source account, destination account, and transfer controls.
Priority: High

## TC-002
Test description: Transfer a valid amount between two owned accounts.
Steps:
  1. Log in with valid credentials.
  2. Open the Transfer Funds page.
  3. Enter a valid amount, for example `150`.
  4. Select a source account.
  5. Select a different destination account.
  6. Click `Transfer`.
Expected result: The page shows `Transfer Complete!` and a confirmation message like `$150.00 has been transferred from account #12345 to account #67890` with a note 
to see Account Activity for more details.
Priority: High

## TC-003
Test description: Transfer with an empty amount field.
Steps:
  1. Log in with valid credentials.
  2. Open the Transfer Funds page.
  3. Leave the amount field empty.
  4. Select source and destination accounts.
  5. Click `Transfer`.
Expected result: The transfer does not complete and the customer sees a validation message or remains on the transfer form without a success confirmation.
Priority: High

## TC-004
Test description: Transfer with a non-numeric amount.
Steps:
  1. Log in with valid credentials.
  2. Open the Transfer Funds page.
  3. Enter `abcd` in the amount field.
  4. Select source and destination accounts.
  5. Click `Transfer`.
Expected result: The transfer does not complete and no account balance changes.
Priority: High

## TC-005
Test description: Transfer a decimal amount between two accounts.
Steps:
  1. Log in with valid credentials.
  2. Open the Transfer Funds page.
  3. Enter `50.75` in the amount field.
  4. Select a source account.
  5. Select a different destination account.
  6. Click `Transfer`.
Expected result: The page shows `Transfer Complete!` and the confirmation message includes the decimal amount.
Priority: High

## TC-006
Test description: Transfer when source and destination accounts are the same.
Steps:
  1. Log in with valid credentials.
  2. Open the Transfer Funds page.
  3. Enter `100` in the amount field.
  4. Select the same account for both source and destination.
  5. Click `Transfer`.
Expected result: The transfer is rejected and an error message is shown. 
Transferring to the same account is not a valid operation.
Priority: High

## TC-007
Test description: Open Account Activity after a successful transfer.
Steps:
  1. Log in with valid credentials.
  2. Open the Transfer Funds page.
  3. Complete a transfer with a valid amount.
  4. Click the `Account Activity` link.
  5. Confirm the recent transfer appears in the transaction list.
Expected result: The Account Activity page is visible and the transfer is listed in the transaction history.
Priority: Medium

## TC-008
Test description: Access the Transfer Funds page without logging in.
Steps:
  1. Open a fresh browser session without logging in.
  2. Navigate directly to the Transfer Funds URL.
Expected result: The user cannot access the Transfer Funds page and is redirected to login or shown an authentication error.
Priority: High
 