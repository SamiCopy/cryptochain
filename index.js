const express = require('express');
const Blockchain = require('./blockchain/blockchain');
const PubSub = require('./application/pubsub');
const axios = require('axios');
const path = require('path');
const PoolofTransactions = require('./wallet/pool');
const Wallet = require('./wallet/wallet');
const Miner = require('./application/miner');
const ContractManager = require('./smartcontracts/contractmanager');  //new
const Transaction = require('./wallet/transaction'); // Add this line


const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

const app = express();
const blockchain = new Blockchain();
const poolofTransactions = new PoolofTransactions();
const wallet = new Wallet();
const contractManager = new ContractManager();  //new
const pubsub = new PubSub({ blockchain, poolofTransactions, wallet, rootNodeAddress: ROOT_NODE_ADDRESS });
const miner = new Miner({
    blockchain,
    poolofTransactions,
    wallet,
    pubsub,
    contractManager             //new
});
app.use(express.json());
app.use(express.static(path.join(__dirname,'frontend/dist'))); //now all files within the frontend folder can be served to the browser through express


app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.get('/api/contract-transactions/:address', (req, res) => {
    const { address } = req.params;
    const transactions = [];
  
    // Iterate over the blockchain to find transactions related to the contract
    for (let block of blockchain.chain) {
      for (let transaction of block.data) {
        if (transaction.contractAddress === address) {
          transactions.push(transaction);
        }
      }
    }
  
    if (transactions.length > 0) {
      res.json({ type: 'success', transactions });
    } else {
      res.json({ type: 'error', message: 'No transactions found for this contract' });
    }
  });

app.post('/api/deploy-contract', (req, res) => {                //new
    const { code } = req.body;

    try {
        const transaction = Transaction.createContractTransaction({
            senderWallet: wallet,
            code
        });

        poolofTransactions.setTransaction(transaction);
        pubsub.broadcastTransaction(transaction);

        res.json({ type: 'success', transaction });
    } catch (error) {
        res.status(400).json({ type: 'error', message: error.message });
    }
});

app.post('/api/interact-contract', (req, res) => {                      //new
    const { contractAddress, params } = req.body;

    try {
        const transaction = Transaction.createContractInteractionTransaction({
            senderWallet: wallet,
            contractAddress,
            params
        });

        poolofTransactions.setTransaction(transaction);
        pubsub.broadcastTransaction(transaction);

        res.json({ type: 'success', transaction });
    } catch (error) {
        res.status(400).json({ type: 'error', message: error.message });
    }
});

// index.js

app.get('/api/contract-transactions/:address', (req, res) => {
    const { address } = req.params;
    const transactions = [];
  
    // Iterate over the blockchain to find transactions related to the contract
    for (let block of blockchain.chain) {
      for (let transaction of block.data) {
        if (transaction.contractAddress === address) {
          transactions.push(transaction);
        }
      }
    }
  
    if (transactions.length > 0) {
      res.json({ type: 'success', transactions });
    } else {
      res.json({ type: 'error', message: 'No transactions found for this contract' });
    }
  });
  
app.get('/api/contract/:address', (req, res) => {
    const contract = contractManager.getContract(req.params.address);

    if (contract) {
        res.json({
            code: contract.code,
            state: contract.state,
            deployer: contract.deployer,
            deploymentTime: contract.deploymentTime
        });
    } else {
        res.status(404).json({ type: 'error', message: 'Contract not found' });
    }
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;
    blockchain.add_block({ data });
    pubsub.broadcastBlockchain();
    res.redirect('/api/blocks');
});

app.post('/api/transact', ( req, res ) => {

    const { recipient, amount } = req.body;

    let transaction = poolofTransactions
                    .existingTransaction( { inputAddress: wallet.publicKey } )

    try{ if ( transaction ) {

        transaction.update( { senderWallet: wallet, recipient, amount } );

        } else {

            transaction = wallet.createTransaction( { 

                recipient,
                amount,
                chain: blockchain.chain
            
            } );

        }

    } catch(error){

        return res.status(400).json( { type: 'error', message: error.message } )

    }
    poolofTransactions.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction);
    res.json( { type: 'Successful' ,transaction } );

})

app.get('/api/mapoftransactionpool', ( req, res) => {

    res.json(poolofTransactions.transactionMap);

})

app.get('/api/minetransactions', ( req, res ) => {

    miner.mineTransaction();
    res.redirect('/api/blocks');

})

app.get('/api/wallet-info', (req, res) => {
    const { publicKey } = wallet;  // Destructure publicKey from the wallet object

    res.json({
        address: publicKey,
        balance: Wallet.calculateBalance({ chain: blockchain.chain, address: publicKey })
    });
});


app.get("*", (req, res) => {

    res.sendFile(path.join( __dirname, "frontend/dist/index.html" ));

     //specified path must be absolute, so using a native node module, called path, to specify current directory with path
} )


const syncChains = async () => {
    try {
        const response = await axios.get(`${ROOT_NODE_ADDRESS}/api/blocks`);
        const rootChain = response.data;

        console.log(`The Below chain is synchronized across all peers... ${JSON.stringify(rootChain, null, 2)}`);
        blockchain.replacechain(rootChain);

    } catch (error) {
        console.error(`Failed to sync chains: ${error.message || error}`);
    }
};

const syncTransactionPool = async () => {
    try {
        const response = await axios.get(`${ROOT_NODE_ADDRESS}/api/mapoftransactionpool`);
        const rootTransactionMap = response.data;

        console.log(`Synchronizing transaction pool across peers... ${JSON.stringify(rootTransactionMap, null, 2)}`);
        poolofTransactions.setMap(rootTransactionMap);

    } catch (error) {
        console.error(`Failed to sync transaction pool: ${error.message || error}`);
    }
};


// ==== Seeding the backend with multiple blocks with transactions from different wallets ======

// const wallet2 = new Wallet();
// const wallet3 = new Wallet();

// const generateWalletTransaction = ( { wallet, recipient, amount } ) => {

//     const transaction = wallet.createTransaction( {

//         recipient,
//         amount,
//         chain: blockchain.chain

//     } );


//     poolofTransactions.setTransaction(transaction);

// }

// const walletSeeding = (  ) => generateWalletTransaction( {

//     wallet: wallet,
//     recipient: wallet2.publicKey,
//     amount: 3

// } );

// const wallet2Seeding = (  ) => generateWalletTransaction( {

//     wallet: wallet2,
//     recipient: wallet3.publicKey,
//     amount: 15

// });

// const wallet3Seeding = (  ) => generateWalletTransaction( {

//     wallet: wallet3,
//     recipient: wallet.publicKey,
//     amount: 7

// });

// for (let i = 0; i < 10; i++) {

//     if( i % 3 === 0 ) {

//         walletSeeding();
//         wallet2Seeding();

//     } else if ( i % 3 === 1 ) {

//         walletSeeding();
//         wallet3Seeding();

//     } else {

//         wallet2Seeding();
//         wallet3Seeding();

//     }

//     miner.mineTransaction()

// }



//======================== End of seeding ===============================


let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const Port = PEER_PORT || DEFAULT_PORT;

app.listen(Port, () => {
    console.log(`Now listening at host ${Port}`);
    if (Port !== DEFAULT_PORT) {
        syncChains();
        syncTransactionPool();
    }
});
