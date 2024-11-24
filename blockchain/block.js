// Blockchain/block.js

const { GENESIS_DATA, MINE_RATE } = require("../defaultvalues");
const cryptoHash = require('../algorithms/crypto-hash');
const hextobinary = require('hex-to-binary');
const { VM } = require('vm2');

class Block {
    constructor({ timestamp, lastHash, hash, data, difficulty, nonce }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data; // This can now include transactions and contract interactions
        this.difficulty = difficulty;
        this.nonce = nonce;
    }

    static Genesis() {
        return new Block(GENESIS_DATA);
    }

    static mineblock({ lastBlock, data, contractManager }) {
        const lastHash = lastBlock.hash;
        let hash, timestamp;
        let { difficulty } = lastBlock;
        let nonce = 0;

        // Execute smart contracts before mining the block
        Block.executeContracts({ data, contractManager });

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
            hash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);
        } while (hextobinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));

        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash
        });
    }

    static executeContracts({ data, contractManager }) {
        for (let transaction of data) {
            if (transaction.type === 'contract_creation') {
                const existingContract = contractManager.getContract(transaction.contractAddress);
                if (!existingContract) {
                    const contract = contractManager.deployContract(
                        transaction.code,
                        transaction.contractAddress,
                        transaction.input.address
                    );
                    contract.state = contract.state || {};
                }
            } else if (transaction.type === 'contract_interaction') {
                const contract = contractManager.getContract(transaction.contractAddress);
                if (contract) {
                    console.log(`Executing contract interaction for contract address: ${contract.address}`);
                    console.log(`Contract state before execution: ${JSON.stringify(contract.state)}`);
                    const vm = new VM({
                        sandbox: {
                            state: contract.state,
                            params: transaction.params,
                            console,
                        },
                        timeout: 1000,
                    });
                    try {
                        const codeToExecute = `
                            (function() {
                                ${contract.code}
                            })();
                        `;
                        vm.run(codeToExecute);
                        // Update contract state after execution
                        contract.state = vm.sandbox.state;
                        contractManager.contracts[contract.address].state = contract.state;
                        console.log(`Contract state after execution: ${JSON.stringify(contract.state)}`);
                    } catch (error) {
                        console.error('Contract execution error during mining:', error);
                    }
                } else {
                    console.error(`Contract with address ${transaction.contractAddress} not found during mining.`);
                }
            }
        }
    }
        
    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;
        if (difficulty < 1) {
            return 1;
        }
        const difference = timestamp - originalBlock.timestamp;
        if (difference > MINE_RATE) {
            return difficulty - 1;
        }
        return difficulty + 1;
    }
}

module.exports = Block;
