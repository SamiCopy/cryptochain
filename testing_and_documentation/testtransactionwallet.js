const Wallet = require('../wallet/wallet');
const Transaction = require('../wallet/transaction');

// Create a new wallet for the sender
const senderWallet = new Wallet();

// Test for creating a valid transaction
console.log("Running Transaction Tests...");
try {
    const transaction = senderWallet.createTransaction({
        recipient: 'recipient-public-key',
        amount: 50
    });

    console.log("Transaction created successfully:");
    console.log(transaction);

    if (Transaction.validTransaction(transaction)) {
        console.log("Valid transaction test passed.");
    } else {
        console.error("Assertion failed: Valid transaction test failed");
    }

} catch (error) {
    console.error(`Error during transaction creation: ${error.message}`);
}

// Test for creating an invalid transaction (amount greater than balance)
try {
    const invalidTransaction = senderWallet.createTransaction({
        recipient: 'recipient-public-key',
        amount: 1500 // Amount greater than balance
    });

    if (!Transaction.validTransaction(invalidTransaction)) {
        console.log("Invalid transaction test passed.");
    } else {
        console.error("Transaction should have failed, but it did not.");
    }

} catch (error) {
    console.error(`Expected failure during invalid transaction creation: ${error.message}`);
}
