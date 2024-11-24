const Block = require('./block');
const cryptoHash = require('../algorithms/crypto-hash');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/wallet');
const { REWARD_INPUT, MINING_REWARD } = require('../defaultvalues');


class Blockchain{

    constructor(){

        this.chain = [Block.Genesis()];

    }


    add_block({ data, contractManager }) {
        const newBlock = Block.mineblock({
            lastBlock: this.chain[this.chain.length - 1],
            data,
            contractManager
        });

        this.chain.push(newBlock);
    }

    static isValidChain(chain){

        //stringify is used, because in JS, === means that the things that are being compared are exactly
        // one and the same, like two objects that are same are not equal with '==='

        if ( JSON.stringify( chain[0]) !== JSON.stringify( Block.Genesis() ) ){

            return false;

        };

        for ( let i = 1; i < chain.length; i++){
             
            const { timestamp, lastHash, hash, data, difficulty, nonce } = chain[i];

            const actualLastHash = chain[i-1].hash;

            const lastDifficulty = chain[i-1].difficulty;

            if (lastHash !== actualLastHash){

                return false;

            }

            const validatedHash = cryptoHash(timestamp, lastHash, data, difficulty, nonce);

            if ( hash !== validatedHash ) {

                return false;


            }
            
            if ( Math.abs(lastDifficulty - difficulty ) > 1 ){
                
                return false;

            }
        
                
                
        }

        return true;

    }

    replacechain (chain, validationRequired, onSuccess) {

        if (chain.length <= this.chain.length) {
            console.warn('Received chain is not longer than the current chain.');
            return;
        }
    
        if (!Blockchain.isValidChain(chain)) {
            console.error('The received chain is invalid.');
            return;
        }
    
        if (validationRequired && !this.validTransactionData({ chain })) {
            console.error('The incoming chain has invalid transaction data.');
            return;
        }
    
        if (onSuccess) {
            onSuccess();
        }
    
        console.log('Replacing the current chain with:', chain);
        this.chain = chain;
    }


    
    endOfChain(){

        const EndOfChain = this.chain[this.chain.length-1];

        return EndOfChain;

    }

    validTransactionData( { chain } ) {


        for (let i = 0; i < chain.length; i++ ) {

            const block = chain[i];

            const transactionSet = new Set();  

            let rewardTransactionCount = 0;

            for ( let transaction of block.data ) {

                //1. Check if the transaction recepient is the miner

                if ( transaction.input.address === REWARD_INPUT.address ) {

                    rewardTransactionCount = rewardTransactionCount + 1;

                    //2. Check if the miner is being rewarded more than one reward per Block

                    if ( rewardTransactionCount > 1 ) {

                        console.error( ' Reward limit per Block is One only. ' );

                        return false;

                    }

                    //3. Check if the miner is being rewarded more than the standard amount per Block -- valid output amount for miner transactions
                    
                    if ( Object.values(transaction.outputMap ) [0] !== MINING_REWARD  ) {
                    
                    let invalidReward = Object.values( transaction.outputMap ) [0]

                    console.log(`Expected ${MINING_REWARD}, Recieved ${invalidReward}`);

                    console.error( ' Invalid reward amount for mining the block ' );

                    return false;

                    } 

                } else { 

                    //4. Check if the transaction itself is valid, which also has further conditions   -- valid output amount for normal transactions

                    if ( !Transaction.validTransaction(transaction) ) {

                        console.error( ' Invalid Transaction ' );

                        return false;

                    }

                } 
                     //5. Check if the input amount is matching the one stored in current blockchain.
                
                const trueBalance = Wallet.calculateBalance({

                    chain: this.chain,

                    address: transaction.input.address

                })



                if ( transaction.input.amount !== trueBalance ) {

                    console.error( ' Invalid input amount ' )

                    return false;      
                    
                }


                //6. Make sure there are no duplicate transactions by using the Set Data Structure.

                if ( transactionSet.has(transaction) ) {

                    console.error('Duplicate transactions were found.');

                    return false;


                } else {

                    transactionSet.add(transaction);

                }

            }

        }

        return true;

    }



}

module.exports = Blockchain;




