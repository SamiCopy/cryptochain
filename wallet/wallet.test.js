const Wallet = require('./wallet');
const Blockchain =  require('../blockchain/blockchain');
const { STARTING_BALANCE } = require('../defaultvalues');

describe('Wallet', () => {

    let wallet;

    beforeEach( () => {

        wallet = new Wallet;

    } )
    
    it (' has a balance ', () => {

        expect(wallet).toHaveProperty('balance');

    })

    it ('has a publicKey', () => {

        expect(wallet).toHaveProperty('publicKey')

    })

    describe('calculateBalance()', () => {

        let blockchain;

        beforeEach( () => {

            blockchain = new Blockchain();

        })


        describe('No outputs, for a wallet', () => {

            it('returns the `STARTING_BALANCE` ', () => {

                expect(

                    Wallet.calculateBalance({

                        chain: blockchain.chain,
                        address: wallet.publicKey

                    })
                ).toEqual(STARTING_BALANCE);
            });
        })

        describe('Outputs exist, for a wallet', () => {

            let transactionOne, transactionTwo;

            beforeEach( () => {

                transactionOne = new Wallet().createTransaction({

                    recipient: wallet.publicKey ,
                    amount: 50

                })

                
                transactionTwo = new Wallet().createTransaction({

                    recipient: wallet.publicKey ,
                    amount: 60

                })

                blockchain.add_block({

                    data: [ transactionOne, transactionTwo ]

                });

                
            } )
            it('adds the sum of outputs to wallet balance ', () => {
                
                expect(

                    Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey
                    })

                ).toEqual(
                    STARTING_BALANCE +
                    transactionOne.outputMap[wallet.publicKey] +
                    transactionTwo.outputMap[wallet.publicKey]
                )
            });
        })
    })

    // describe( validTransactionData, () => {

    //     let transaction, rewardTransaction, wallet;

    //     beforeEach( () => {

    //         wallet = new Wallet();
    //         transaction = wallet.createTransaction( { recipient: "sami2", amount: 650 } );
    //         rewardTransaction = Transaction.rewardTransaction( { minerWallet: wallet } )

    //     } );


    //     describe ( 'The data is valid', () => {

    //         it('should return true', () => {
    //             newChain.add_block( { data: [ transaction, rewardTransaction ] } );

    //         });


    //     } )



    // } )

})