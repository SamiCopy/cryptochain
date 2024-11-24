const Transaction = require("../wallet/transaction");
// const pubsub = require('../application/pubsub');

class Miner {
    constructor({ blockchain, poolofTransactions, wallet, pubsub, contractManager }) {
        this.blockchain = blockchain;
        this.poolofTransactions = poolofTransactions;
        this.wallet = wallet;
        this.pubsub = pubsub;
        this.contractManager = contractManager;
    }

    mineTransaction() {
        const validTransactions = this.poolofTransactions.validTransactions();

        validTransactions.push(
            Transaction.rewardTransaction({ minerWallet: this.wallet })
        );

        this.blockchain.add_block({
            data: validTransactions,
            contractManager: this.contractManager
        });

        this.pubsub.broadcastBlockchain();
        this.poolofTransactions.clearTransactions();
    }
}


module.exports = Miner;