// wallet/transaction.js

const { v1: uuidv1 } = require('uuid');
const { verifySignature } = require('../algorithms/crypto-elliptic');
const { REWARD_INPUT, MINING_REWARD } = require('../defaultvalues');

const CONTRACT_CREATION_GAS_FEE = 50;
const CONTRACT_INTERACTION_GAS_FEE = 5;

class Transaction {
    constructor({ senderWallet, recipient, amount, outputMap, input, type, code, contractAddress, params }) {
        this.id = uuidv1();
        this.type = type || 'standard';
        this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount });
        this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap });
        this.code = code;
        this.contractAddress = contractAddress;
        this.params = params;
    }

    createOutputMap({ senderWallet, recipient, amount }) {
        const outputMap = {};
        if (this.type === 'contract_creation') {
            outputMap[senderWallet.publicKey] = senderWallet.balance - CONTRACT_CREATION_GAS_FEE;
        } else if (this.type === 'contract_interaction') {
            outputMap[senderWallet.publicKey] = senderWallet.balance - CONTRACT_INTERACTION_GAS_FEE;
        } else {
            outputMap[recipient] = amount;
            outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
        }
        return outputMap;
    }

    createInput({ senderWallet, outputMap }) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
    }

    update({ senderWallet, recipient, amount }) {
        if (!this.outputMap[recipient]) {
            this.outputMap[recipient] = amount;
        } else {
            this.outputMap[recipient] += amount;
        }

        this.outputMap[senderWallet.publicKey] -= amount;
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
    }

    static validTransaction(transaction) {
        const { input: { address, amount, signature }, outputMap } = transaction;
        const outputTotal = Object.values(outputMap).reduce((total, outputAmount) => total + outputAmount, 0);

        if (transaction.type === 'contract_creation') {
            if ((amount - outputTotal) !== CONTRACT_CREATION_GAS_FEE) {
                console.error(`Invalid Contract Creation Transaction from ${address}`);
                return false;
            }
        } else if (transaction.type === 'contract_interaction') {
            if ((amount - outputTotal) !== CONTRACT_INTERACTION_GAS_FEE) {
                console.error(`Invalid Contract Interaction Transaction from ${address}`);
                return false;
            }
        } else if (transaction.type === 'gas_fee_deduction') {
            // Gas fee deductions are not user-initiated and happen automatically, skip checks
            return true;
        } else {
            if (amount !== outputTotal) {
                console.error(`Invalid Transaction from ${address}`);
                return false;
            }
        }

        if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
            console.error(`Invalid signature from ${address}`);
            return false;
        }

        return true;
    }

    static rewardTransaction({ minerWallet }) {
        return new this({
            input: REWARD_INPUT,
            outputMap: { [minerWallet.publicKey]: MINING_REWARD }
        });
    }

    static createContractTransaction({ senderWallet, code }) {
        return new this({
            senderWallet,
            code,
            amount: senderWallet.balance,
            type: 'contract_creation',
            contractAddress: uuidv1(),
            outputMap: { [senderWallet.publicKey]: senderWallet.balance - CONTRACT_CREATION_GAS_FEE },
        });
    }

    static createContractInteractionTransaction({ senderWallet, contractAddress, params }) {
        return new this({
            senderWallet,
            amount: senderWallet.balance,
            type: 'contract_interaction',
            contractAddress,
            params,
            outputMap: { [senderWallet.publicKey]: senderWallet.balance - CONTRACT_INTERACTION_GAS_FEE },
        });
    }
}

module.exports = Transaction;
