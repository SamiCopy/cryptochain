// SmartContracts/contractManager.js

const Contract = require('./contract');

class ContractManager {
    constructor() {
        this.contracts = {}; // Map of contract address to Contract instance
    }

    deployContract(code, address, deployer) {
        const contract = new Contract({ code, address, deployer });
        this.contracts[contract.address] = contract;
        return contract;
    }

    getContract(address) {
        return this.contracts[address];
    }
}

module.exports = ContractManager;
