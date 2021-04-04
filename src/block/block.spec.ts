import Block from './block'
import { advanceBy, advanceTo, clear } from 'jest-date-mock'
import cryptoJs from 'crypto-js'

jest.mock('crypto-js', () => ({
    SHA256: jest.fn(),
}))

const mockSha256 = cryptoJs.SHA256 as jest.Mock

describe('Block', () => {
    beforeEach(() => {
        advanceTo(new Date(1984, 4, 22, 17, 0, 0))
    })

    afterEach(() => {
        clear()
    })

    it('returns a stringified instance', () => {
        const now = new Date()
        const lastHash = 'last-hash'
        const hash = 'this-hash'
        const data = [{}]
        const block = new Block(now, lastHash, hash, data)

        expect(block.toString()).toStrictEqual(`Block -
          Timestamp: ${now}
          Last Hash: ${lastHash}
          Hash     : ${hash}
          Data     : ${data}`)
    })

    it('provides a genesis block', () => {
        const genesisBlock = Block.gensis()

        expect(genesisBlock).toBeInstanceOf(Block)

        expect(genesisBlock.toString()).toStrictEqual(`Block -
          Timestamp: ${new Date()}
          Last Hash: -----
          Hash     : f1r57-h45h
          Data     : `)
    })

    it('provides a mineBlock function', () => {
        const genesisBlock = Block.gensis()
        const hash = '87838ed85d634e4b12f43b8da73516b4abbabc7d5b3efe3dbde4e786ff1d7779'
        mockSha256.mockReturnValueOnce(hash)

        advanceBy(3000)

        const minedBlock = Block.mineBlock(genesisBlock, 'First mined block')

        expect(minedBlock.toString()).toStrictEqual(`Block -
          Timestamp: ${minedBlock.timestamp}
          Last Hash: ${genesisBlock.hash}
          Hash     : ${hash}
          Data     : First mined block`)
    })
})
