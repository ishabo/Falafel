import Block, {BlockData} from './block'
import Util from '@falafel/util'
import { advanceBy, advanceTo, clear } from 'jest-date-mock'
import { DEFAULT_DIFFICULTY } from '@falafel/constants'
import hex2Bin from 'hex-to-bin'

jest.mock('@falafel/constants', () => ({
  DEFAULT_DIFFICULTY: 4,
  MINE_RATE: 3000,
}))

jest.mock('@falafel/util', () => ({
  genHash: jest.fn(),
}))

const mockSha256 = Util.genHash as jest.Mock
const hashWithLeeding0Zeros = '9456ed85d634e4b12f43b8da73516b4abbabc7d5b3efe3dbde4e786ff1d7779' // hex2Bin => 10011010...
const hashWithLeeding1Zeros = '5a35ed85d634e4b12f43b8da73516b4abbabc7d5b3efe3dbde4e786ff1d7779' // hex2Bin => 01011010...
const hashWithLeeding2Zeros = '2f45ed85d634e4b12f43b8da73516b4abbabc7d5b3efe3dbde4e786ff1d7779' // hex2Bin => 00100101...
const hashWithLeeding3Zeros = '1456ed85d634e4b12f43b8da73516b4abbabc7d5b3efe3dbde4e786ff1d7779' // hex2Bin => 00010100...
const hashWithLeeding4Zeros = '0f5eed85d634e4b12f43b8da73516b4abbabc7d5b3efe3dbde4e786ff1d7779' // hex2Bin => 00001111...

describe('Block', () => {
  beforeEach(() => {
    advanceTo(new Date(1984, 4, 22, 17, 0, 0))
  })

  afterEach(() => {
    clear()
  })

  it('returns a stringified instance', () => {
    const now = Date.now()
    const lastHash = 'last-hash'
    const data = [] as BlockData
    const nonce = 0
    const block = new Block({ timestamp: now, lastHash, hash: hashWithLeeding4Zeros, data, nonce })

    expect(block.toString()).toStrictEqual(`Block -
          Timestamp : ${new Date(now).toISOString()}
          Last Hash : ${lastHash}
          Hash      : ${hashWithLeeding4Zeros.substring(0, 10)}
          Nonce     : ${nonce}
          Difficulty: ${DEFAULT_DIFFICULTY}
          Data      : ${data}`)
  })

  it('provides a genesis block', () => {
    const genesisBlock = Block.genesis()

    expect(genesisBlock).toBeInstanceOf(Block)

    expect(genesisBlock.toString()).toStrictEqual(`Block -
          Timestamp : 1899-12-31T00:00:00.000Z
          Last Hash : -----
          Hash      : f1r57-h45h
          Nonce     : 0
          Difficulty: ${DEFAULT_DIFFICULTY}
          Data      : `)
  })

  describe('mining blocks', () => {
    let genesisBlock: Block
    let firstMinedBlock: Block

    let adjustDifficulty = DEFAULT_DIFFICULTY
    let nonce = 1
    const firstBlockData = ['First mined block'] as unknown as BlockData
    const secondBlockData = ['Second mined block'] as unknown as BlockData

    beforeAll(() => {
      genesisBlock = Block.genesis()
      advanceBy(3000)
    })

    beforeEach(() => {
      mockSha256.mockReturnValue(hashWithLeeding4Zeros)
      firstMinedBlock = Block.mineBlock(genesisBlock, firstBlockData)
      adjustDifficulty = genesisBlock.difficulty - 1
    })

    afterEach(() => {
      mockSha256.mockClear()
    })

    describe('mining first block', () => {
      it('mines block for a given data set and links it to previous block', () => {
        expect(firstMinedBlock.lastHash).toStrictEqual(genesisBlock.hash)
      })

      it('adjusts the default difficulty to be less than the default for the first block', () => {
        expect(firstMinedBlock.difficulty).toStrictEqual(DEFAULT_DIFFICULTY - 1)
      })

      it('would have created SHA256 one time with nonce = 1 given that the expected leeding zeros were found at once', () => {
        expect(mockSha256).toHaveBeenCalledTimes(1)
        expect(mockSha256).toHaveBeenCalledWith(
          `${firstMinedBlock.timestamp}${genesisBlock.hash}${JSON.stringify(firstBlockData)}${nonce}${adjustDifficulty}`
        )
      })

      it('has a re-calculable hash given the same timestamp, lastHash, nonce, data and difficulty', () => {
        const blockHash = Block.blockHash(firstMinedBlock)

        expect(blockHash).toStrictEqual(hashWithLeeding4Zeros)
        mockSha256.mockReset()
      })
    })

    describe('mining second block', () => {
      it('runs the hash generating function X nonce times and adjusts the difficulty based on previous timestamp', () => {
        let timeSinceFirstBLock = 0

        advanceBy(2000)
        timeSinceFirstBLock += 2000

        mockSha256.mockReset()
        mockSha256
          .mockImplementationOnce(() => {
            advanceBy(0)
            return hashWithLeeding3Zeros
          }) // adjustDifficulty increases from 3 to 4
          .mockImplementationOnce(() => {
            advanceBy(0)
            return hashWithLeeding1Zeros
          }) // adjustDifficulty decreases from 3 to 2
          .mockImplementationOnce(() => {
            advanceBy(1000)
            timeSinceFirstBLock += 1000
            return hashWithLeeding2Zeros
          }) // adjustDifficulty stablizes
          .mockImplementationOnce(() => {
            advanceBy(1000)
            timeSinceFirstBLock += 1000
            return hashWithLeeding1Zeros
          }) // adjustDifficulty stablizes
          .mockImplementationOnce(() => {
            advanceBy(0)
            return hashWithLeeding0Zeros
          }) // adjustDifficulty stablizes
          .mockImplementationOnce(() => {
            return hashWithLeeding2Zeros
          }) // <== Should stop at this
          .mockImplementationOnce(() => {
            return hashWithLeeding0Zeros
          })

        const nonce = 6

        const secondMinedBlock = Block.mineBlock(firstMinedBlock, secondBlockData)

        expect(secondMinedBlock.toString()).toStrictEqual(`Block -
          Timestamp : ${new Date(secondMinedBlock.timestamp).toISOString()}
          Last Hash : ${firstMinedBlock.hash.substring(0, 10)}
          Hash      : ${hashWithLeeding2Zeros.substring(0, 10)}
          Nonce     : ${nonce}
          Difficulty: ${2}
          Data      : ${secondBlockData}`)

        expect(secondMinedBlock.timestamp).toStrictEqual(
          new Date(1984, 4, 22, 17, 0, 0).getTime() + timeSinceFirstBLock
        )
        expect(hex2Bin(secondMinedBlock.hash).substring(0, 2)).toStrictEqual('0'.repeat(2))
        expect(mockSha256).toHaveBeenCalledTimes(6)
      })
    })
  })
})
