// we're using the SHA-256 hashing algo is kay through ham ek string like "sami" ko convert krsktay hain in a "SHA-256" hash
//note -- ye ek one way procedure hay, data is converted into a hash, but a hash can not be reverse engineered because the bruteforce time requried would exponentially high. also used in bit coin, lime coin etc.

const crypto = require('crypto')            //importing nodejs module, it has hash and other functions pre-built

const cryptoHash = (...inputs) => {              //...inputs because we dont know the amount of inputs we might get

    const hash = crypto.createHash('sha256');  // now any value entered/given to hash object will be hashed in sha256

    hash.update( inputs.map( ( input )  => JSON.stringify( input ) ).sort().join(' ')); 
    // regardless of attribute submission order, ham alphebatically hi output dena chahtay hain.

    return hash.digest('hex');  //digest does the enoding that is preveously selected, otherwise utf-8 if left empty

}

module.exports = cryptoHash;
