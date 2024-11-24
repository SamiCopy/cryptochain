// smartcontracts/contract.js
const { v4: uuidv4 } = require('uuid');

class Contract {
    constructor({ code, address, deployer }) {
        this.id = uuidv4();
        this.code = code;
        this.address = address || this.generateAddress();
        this.state = {};
        this.deployer = deployer || 'Unknown'; // Provide a default value
        this.deploymentTime = Date.now(); // Ensure this is set to a valid timestamp
    }

    generateAddress() {
        return uuidv4();
    }
}

module.exports = Contract;
