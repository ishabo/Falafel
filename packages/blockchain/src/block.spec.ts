import Block from './block'
import cryptoJs from 'crypto-js'
import { advanceBy, advanceTo, clear } from 'jest-date-mock'

jest.mock('crypto-js', () => ({
  SHA256: jest.fn(),
}))

const mockSha256 = cryptoJs.SHA256 as jest.Mock
const hash = '87838ed85d634e4b12f43b8da73516b4abbabc7d5b3efe3dbde4e786ff1d7779'

mockSha256.mockReturnValue(hash)

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
    const data = [{}]
    const block = new Block(now, lastHash, hash, data)

    expect(block.toString()).toStrictEqual(`Block -
          Timestamp: ${now}
          Last Hash: ${lastHash}
          Hash     : ${hash.substring(0, 10)}
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

    advanceBy(3000)

    const minedBlock = Block.mineBlock(genesisBlock, 'First mined block')

    expect(minedBlock.toString()).toStrictEqual(`Block -
          Timestamp: ${minedBlock.timestamp}
          Last Hash: ${genesisBlock.hash.substring(0, 10)}
          Hash     : ${hash.substring(0, 10)}
          Data     : First mined block`)
  })

  it('generates has for a given block', () => {
    const genesisBlock = Block.gensis()

    advanceBy(3000)
    const block = Block.mineBlock(genesisBlock, 'First mined block')

    mockSha256.mockClear()

    const blockHash = Block.blockHash(block)

    expect(blockHash).toStrictEqual(hash)
    expect(mockSha256).toHaveBeenCalledTimes(1)
  })
})
