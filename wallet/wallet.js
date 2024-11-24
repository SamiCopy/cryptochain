const { STARTING_BALANCE } = require('../defaultvalues');
const { ec } = require('../algorithms/crypto-elliptic');
const cryptoHash = require('../algorithms/crypto-hash');
const Transaction = require('./transaction')

class Wallet{

    constructor() {

        this.balance = STARTING_BALANCE;
        this.keyPair = ec.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
        

    }

    sign(data) {

        return this.keyPair.sign(cryptoHash(data));

    }

    createTransaction( { recipient, amount, chain} ) {

        if ( !recipient || typeof recipient !== 'string' ) {

            throw new Error ( " Invalid recipient address " )

        }


        if (amount <= 0) {

            throw new Error ( `Your entered amount ${amount} 
                is not valid. ` )

        }

        if (chain) {

            this.balance = Wallet.calculateBalance({
                chain,
                address: this.publicKey

            })


        }

        if ( amount > this.balance ) {

            throw new Error (`Insufficient balance for this transaction. 
                Amount ${amount} exceeds balance ${this.balance}.`);


        }

        return new Transaction( { senderWallet: this, recipient, amount } )

        //this refers to this particular object...

    }


    static calculateBalance({ chain, address }) {

        let hasConductedTransaction = false;
        let outputsTotal = 0;
      
        for (let i = chain.length - 1; i > 0; i--) {
          const block = chain[i];
      
          for (let transaction of block.data) {
            if (transaction.input.address === address) {
              hasConductedTransaction = true;
            }
      
            const addressOutput = transaction.outputMap[address];
      
            if (addressOutput) {
              outputsTotal += addressOutput;
            }
          }
      
          if (hasConductedTransaction) {
            break;          //finally found the most recent transaction, no need to iterate the rest of the blocks. as the address that was given in the parameter, is found to have made a transaction.
          }
        }
      
        return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal;

        //if hasconducted is false, then start + out, if TRUE, then only return outsputTotal
      }

      
};

wa = new Wallet()
console.log(wa.publicKey)

module.exports = Wallet;