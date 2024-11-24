//finding the exact accurate combination of data, nonce and the last hash to meet the leading zero difficulty that is pre-set, takes a huge amount of computational power, and that is proof of work. basically a difficulty of example : 6 could be set. now the miner has to get an output that has exactly 6 leading zeros and matches the data field where nonce is n - once, as n digit is changed at one time, to check its result.  when a miner has successfully mined a block, he shares its nonce value, eg : '213', with other miners
//now they can just verify that, instead of doing more computation, to confirm the validity of the block for example, bitcoin's goal is a new block every 10m, they could inc or dec the difficulty for miners.



//NOTE : ye file sirf tesing ky liye hai, it doesnt add anything to the overall code.






const Blockchain = require ('../blockchain/blockchain');
const testBlockChain = new Blockchain();


let prevTimestamp;
let nextTimestamp;
let timeDiff;
let sum = 0;
let average;
let averagestorage = [];

for( i=1; i<100; i++ ){

    prevTimestamp = testBlockChain.endOfChain().timestamp;
    testBlockChain.add_block({data : i});
    nextTimestamp = testBlockChain.endOfChain().timestamp;
    timeDiff = nextTimestamp-prevTimestamp;
    averagestorage.push(timeDiff);
    console.log(`Previous time ${prevTimestamp} | Data ${i} | Next Time ${nextTimestamp} 
     | TimeDiff ${timeDiff} | Difficulty ${testBlockChain.endOfChain().difficulty}`);

}

//idhar maine i  = 1 rakha, because i've harcoded the genesis time as a string, so can't sum that.

for (let i=1; i<averagestorage.length; i++){
        sum = sum + averagestorage[i];
}

average = sum / averagestorage.length;

console.log(`Average Time or Mine rate: ${average}`)





console.log(testBlockChain);

