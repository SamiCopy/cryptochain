// Wallet/pool.js

const Transaction = require('./transaction');

class PoolofTransactions {
    constructor() {
        this.transactionMap = {};
    }

    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }

    setMap(rootTransactionMap) {
        this.transactionMap = rootTransactionMap;
    }

    existingTransaction({ inputAddress }) {
        const transactions = Object.values(this.transactionMap);

        return transactions.find(
            transaction => transaction.input.address === inputAddress
        );
    }

    validTransactions() {
        return Object.values(this.transactionMap).filter(transaction => {
            // For smart contract transactions, additional validation may be required
            if (transaction.type === 'contract_creation' || transaction.type === 'contract_interaction') {
                // Validate the transaction structure
                return Transaction.validTransaction(transaction);
            } else {
                return Transaction.validTransaction(transaction);
            }
        });
    }

    clearTransactions() {
        this.transactionMap = {};
    }

    clearBlockchainTransactions({ chain }) {
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];

            for (let transaction of block.data) {
                if (this.transactionMap[transaction.id]) {
                    delete this.transactionMap[transaction.id];
                }
            }
        }
    }
}

module.exports = PoolofTransactions;
