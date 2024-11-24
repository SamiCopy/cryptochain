// using this , because its free, aur heroku pr iski compatiblity bhi hay
// pub => a channel that broadcasts(changes, etc)
// sub => subscribers that listen to publishers
// all nodes would be subscribers & publishers of the blockchain 
// if any node publishes any change, the others would listen from the block chain.

const PubNub = require('pubnub');
// const Transaction = require('../wallet/transaction');
const axios = require('axios'); // Import axios if not already imported


const credentials = {

    publishKey: 'pub-c-8b08db12-a890-4322-8953-b86f10cc9655',
    subscribeKey: 'sub-c-c6c23b78-64ab-479f-b804-3a792ac9ed39',
    secretKey: 'sec-c-ODY4OGJhMmYtMjFmMy00ZTdjLTk3NDAtYTFiYTU0Mjc2NGUy',
    userId: 'Ullah'

}


const Channels = {

    test: "Test",
    blockchain: "Blockchain",
    transaction: "Transaction"


}


class PubSub {

    constructor({ blockchain , poolofTransactions, wallet, rootNodeAddress}) {

        this.blockchain = blockchain;
        this.poolofTransactions = poolofTransactions;
        this.wallet = wallet;
        this.rootNodeAddress = rootNodeAddress;
        this.pubnub = new PubNub(credentials);
        this.pubnub.subscribe( { channels: Object.values( Channels ) } );
        this.pubnub.addListener( this.listener() );

    }


    listener() {
        return {
            message: (messageObject) => {
                const { channel, message } = messageObject;

                switch (channel) {
                    case Channels.blockchain:
                        const parsedMessage = JSON.parse(message);

                        if (parsedMessage === 'BLOCKCHAIN_UPDATED') {
                            console.log('Blockchain update message received. Synchronizing chain...');
                            this.syncChain();
                        }
                        break;

                    case Channels.transaction:
                        const transaction = JSON.parse(message);
                        console.log(`Transaction received: ${JSON.stringify(transaction)}`);

                        if (!this.poolofTransactions.existingTransaction({
                            inputAddress: transaction.input.address
                        })) {
                            this.poolofTransactions.setTransaction(transaction);
                            console.log(`Transaction added to the pool.`);
                        }
                        break;

                    default:
                        return;
                }
            }
        };
    }
                


    // publish({ channel, message }) {
    //     this.pubnub.publish({ channel, message }, (status, response) => {
    //         if (status.error) {
    //             console.log(`Publish Error: ${status.message}`);
    //         } else {
    //             // Conditional logging
    //             if (channel === Channels.transaction || channel === Channels.blockchain) {
    //                 console.log(`Message Published: ${response.timetoken}`);
    //             }
    //         }
    //     });
    // }

        // application/pubsub.js

        publish({ channel, message }) {
            this.pubnub.publish({ channel, message }, (status, response) => {
                if (status.error) {
                    console.error(`Publish Error:`, status); // Log the entire status object
                } else {
                    console.log(`Message Published: ${response.timetoken} on channel ${channel}`);
                }
            });
        }
    
        broadcastBlockchain() {
            this.publish({
                channel: Channels.blockchain,
                message: JSON.stringify('BLOCKCHAIN_UPDATED') // Send a simple update message
            });
        }
    
        broadcastTransaction(transaction) {
            this.publish({
                channel: Channels.transaction,
                message: JSON.stringify(transaction)
            });
        }

        syncChain() {
            axios.get(`${this.rootNodeAddress}/api/blocks`)
                .then(response => {
                    const rootChain = response.data;
                    console.log('Synchronizing chain with the latest from root node.');
                    this.blockchain.replacechain(rootChain, true, () => {
                        this.poolofTransactions.clearBlockchainTransactions({
                            chain: rootChain
                        });
                    });
                })
                .catch(error => {
                    console.error('Error synchronizing chain:', error.message);
                });
        }
    }

// const testPubSub = new PubSub;
// testPubSub.publish({channel: Channels.test, message: "Hello, from the other side!"})
module.exports = PubSub;
