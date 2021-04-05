import Blockchain from '.'
import { advanceTo, clear } from 'jest-date-mock'

describe('Blockchian', () => {
    let bc: Blockchain
    let bc2: Blockchain

    beforeEach(() => {
        advanceTo(new Date(1984, 4, 22, 17, 0, 0))
        bc = new Blockchain()
        bc2 = new Blockchain()
    })

    afterEach(() => {
        clear()
    })

    it('initializes with a genesis block', () => {
        expect(bc.chain.length).toStrictEqual(1)
        expect(bc.chain[0].toString()).toStrictEqual(`Block -
          Timestamp: ${new Date()}
          Last Hash: -----
          Hash     : f1r57-h45h
          Data     : `)
    })

    it('adds a new block', () => {
        const data = 'A new block was added'
        bc.addBlock(data)
        expect(bc.chain.length).toStrictEqual(2)
        expect(bc.chain[bc.chain.length - 1].toString()).toMatchInlineSnapshot(`
            "Block -
                      Timestamp: Tue May 22 1984 17:00:00 GMT+0100 (British Summer Time)
                      Last Hash: f1r57-h45h
                      Hash     : 34979328b1
                      Data     : A new block was added"
        `)
    })

    it('links every added block to the last one in chain', () => {
        bc.addBlock('First block')
        bc.addBlock('Second block')
        bc.addBlock('Third block')

        expect(bc.chain[1].lastHash === bc.chain[0].hash)
        expect(bc.chain[2].lastHash === bc.chain[1].hash)
        expect(bc.chain[3].lastHash === bc.chain[2].hash)
    })

    it('validates a valid chain', () => {
        bc2.addBlock('Second chain first block')

        expect(bc.isValidChain(bc2.chain)).toBe(true)
    })

    it('invalidates a chain with a corrupt genesis block', () => {
        bc2.chain[0].data = 'Hacked data!'

        expect(bc.isValidChain(bc2.chain)).toBe(false)
    })

    it('invalidates a corrupt chain', () => {
        bc2.addBlock('Second chain first block')
        bc2.chain[1].data = 'Corrupt data'

        expect(bc.isValidChain(bc2.chain)).toBe(false)
    })

    it('replaces the chain with a valid chain', () => {
        bc2.addBlock('Second chain first block')

        bc.replaceChain(bc2.chain)

        expect(bc.chain).toStrictEqual(bc2.chain)
    })

    it('does not replace the chain with one of less than or equal to length', () => {
        bc.addBlock('First block')

        bc.replaceChain(bc2.chain)

        expect(bc.chain).not.toStrictEqual(bc2.chain)
    })
})
