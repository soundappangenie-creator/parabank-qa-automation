Manual Test Cases - ParaBank Transfer Funds


TC ID : 001: 
Valid Login and Open Transfer Funds Page

Test description: Verify that a valid user can able to log in and open the tranfer funds page.

Steps:
 1. Open the Parabank Application
 2. Enter valid username and password
 3. click Login in.
 4. click Transfer funds from the left menu

Expected result:
User should log in successfully and the transfer funds page should be displayed.

Priority: High

--------------------------------------------------------------------------------------------------------------------------------

TC: 002
Transfer Valid Amount Between Accounts

Test description: Verify that a user can transfer a valid amount between two accounts.

Steps:
1. Log in with valid credentials.
2. Open Transfer Funds page.
3. Enter a valid amount in the amount field.(eg 100)
4. Select source account.
5. Select destination account.
6. Click Transfer button.

Expected result:
User should be able to transfer the amount successfully and a confirmation message should be display the transferred amount and account details.

Priority: High

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

TC-003:
transfer with Empty amount

Test description: Verify that transfer cannot be completed when amount is empty.

Steps:
1. Log in with valid credentials.
2. Open Transfer Funds page.
3. Leave amount field empty.
4. Select source account.
5. Select destination account.
6. Click Transfer button.

Expected result:
User should not be able to transfer the amount successfully and an error message should be displayed.

Priority: High

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------


TC-004:
Transfer With Non- Numeric Amount

Test Description: Verify that transfer cannot be completed with non- numeric amount.

Steps:
1. Log in with valid credentials.
2. Open transfer Funds page.
3, Ebter 'abcd' in amount field.
4. select source account
5. select the destination account
6. clcik transfer.

Expected result:
Transfer should not complete and user should see an error or validation message

Priority: High

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

TC-005:
Transfer with Negative value amount.

Test Descriptiion: Verify that transfer cannot be completed with negative value amount.

Steps:
1. Log in with valid credentials.
2. Open Transfer Funds page.
3. Enter a -50 in the amount field.
4. Select source account.
5. Select destination account.
6. Click Transfer button.

Expected result:
Transfer should not complete and user should see an error or validation message.

Priority: High

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------


TC-006:
Transfer with Zero value amount.

Test Descriptiion: Verify that transfer cannot be completed with zero value amount.

Steps:
1. Log in with valid credentials.
2. Open Transfer Funds page.
3. Enter a 0 in the amount field.
4. Select source account.
5. Select destination account.
6. Click Transfer button.

Expected result:
Transfer should not complete and user should see an error or validation message.

Priority: High

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
TC-007:
Transfer using same source and destination account

Test Description: Verify that transfer cannot be completed when source and destination accounts are the same.

Steps:
1. Log in with valid credentials.
2. Open Transfer Funds page.
3. Enter a valid amount, for example `100`.
4. Select same account in From Account and To Account fields.
5. Click Transfer.

Expected Result: Transfer should not complete or user should see a validation message.

Priority: Medium

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

TC-008:
Access Transfer Funds Without Login

Test Description: Verify that unauthenticated user cannot access Transfer Funds page.

Steps:
1. Open ParaBank application.
2. Navigate directly to Transfer Funds URL without logging in.

Expected Result: User should not access the Transfer Funds page and should be redirected to login or shown an authentication error.

Priority: High

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
