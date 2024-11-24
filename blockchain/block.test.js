const Block = require('./block');
const { GENESIS_DATA } = require('../defaultvalues');


// testing the block class, not the file
// describe ky andar test ka naam, that here its block
// and then a function, so we use an empty parenthesis to call back values into it

describe('Block', () => {
    const timestamp = 'foo-timestamp'  //anything and everything that we could possibly test.
    const lastHash = 'foo-lasthash';
    const hash = 'foo-hash';
    const data = ['sami'];
    const block = new Block({timestamp, lastHash, hash, data});

    //it function will be the actual part jahan ham test likhengy

    it('has a timestamp, last hash, hash and the data value', () => {
        expect(block.timestamp).toEqual(timestamp)
        expect(block.lastHash).toEqual(lastHash)
        expect(block.hash).toEqual(hash)
        expect(block.data).toEqual(data)
    })


    //since ye hamara pehla test hy, need to change test settings from package.json file.
    // now changed jest --watchAll to test all test files

//Genesis Function creates the genesis block and returns it.

    describe('Genesis()', () => {

        const genesisBlock = Block.Genesis()

        it(' returns a block instanse', () => {
            expect(genesisBlock instanceof Block).toBe(true);

        })

        it('returns a genesis data ', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA)
        }
        
        
        )




    })




})