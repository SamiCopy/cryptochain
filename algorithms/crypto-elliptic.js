const ellipticCurve = require('elliptic').ec;
const cryptoHash = require('./crypto-hash');

//ellipticcryptography is based on the mathematical theory that it is computationaly infeasible to guess the elliptic curve,
// the version of ec that Bitcoin uses is StandardsofEfficientCryptographyPrime(SECP256k1) -- K1 is for koblitz, the man behind the algorithm
// in short , it selects a prime number of 256 bits for the ellipticcurve.


const ec = new ellipticCurve('secp256k1');

const verifySignature  = ({ publicKey, data, signature }) => {

    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');
    return keyFromPublic.verify(cryptoHash(data),signature);

}

module.exports = { ec , verifySignature };