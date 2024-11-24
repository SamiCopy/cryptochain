// started with implementing the genesis blocks functionality
//Genesis is the origin of the blocks, its values are hard coded.

const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;
const STARTING_BALANCE = 1000;

const GENESIS_DATA   = {
    timestamp: 'Genesis-Time',
    lastHash: 'PreGenesis-Hash',
    hash: 'Genesis-Hash',
    data: ['Genesis-Data'],
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0
}

const MINING_REWARD = 50;

const REWARD_INPUT = { address: 'WalletAddressOfMiner' };


module.exports = {
     GENESIS_DATA ,
        MINE_RATE , 
            STARTING_BALANCE,
                MINING_REWARD,
                    REWARD_INPUT };