import { advanceTo, clear as clearDateMock } from 'jest-date-mock'
import { Transaction } from '@falafel/wallet'

import Blockchain from '.'
import Block, { BlockData } from './block'

describe('Blockchian', () => {
  let bc: Blockchain
  let bc2: Blockchain
  let errorMock = jest.fn()
  let logMock = jest.fn()
  let blockHashSpy: jest.SpyInstance

  beforeEach(() => {
    advanceTo(new Date(1984, 4, 22, 17, 0, 0))
    bc = new Blockchain()
    bc2 = new Blockchain()
    global.console.error = errorMock
    global.console.log = logMock
  })

  afterEach(() => {
    clearDateMock()
    if (blockHashSpy) {
      blockHashSpy.mockRestore()
    }
  })

  it('initializes with a genesis block', () => {
    expect(bc.chain.length).toStrictEqual(1)
    expect(bc.chain[0].toString()).toMatchInlineSnapshot(`
      "Block -
                Timestamp : 1899-12-31T00:00:00.000Z
                Last Hash : -----
                Hash      : f1r57-h45h
                Nonce     : 0
                Difficulty: 4
                Data      : "
    `)
  })

  it('adds a new block', () => {
    const data = (['A new block was added'] as unknown) as BlockData
    const newBlock = new Block({
      timestamp: Date.now(),
      lastHash: 'f1r57-h45h',
      hash: 'a1a6da8674',
      data,
      nonce: 1,
      difficulty: 3,
    })
    const mineBlockSpy = jest.spyOn(Block, 'mineBlock').mockReturnValueOnce(newBlock)
    bc.addBlock({ data })
    expect(bc.chain.length).toStrictEqual(2)
    expect(bc.chain[bc.chain.length - 1].toString()).toMatchInlineSnapshot(`
      "Block -
                Timestamp : 1984-05-22T16:00:00.000Z
                Last Hash : f1r57-h45h
                Hash      : a1a6da8674
                Nonce     : 1
                Difficulty: 3
                Data      : A new block was added"
    `)

    expect(mineBlockSpy).toHaveBeenCalledTimes(1)
  })

  it('links every added block to the last one in chain', () => {
    const data1 = (['First block'] as unknown) as BlockData
    const data2 = (['second block'] as unknown) as BlockData
    const data3 = (['third block'] as unknown) as BlockData
    const newBlock1 = new Block({
      timestamp: Date.now(),
      lastHash: 'f1r57-h45h',
      hash: '11111111111',
      data: data1,
      nonce: 1,
      difficulty: 3,
    })
    const newBlock2 = new Block({
      timestamp: Date.now(),
      lastHash: '11111111111',
      hash: '2222222222',
      data: data2,
      nonce: 2,
      difficulty: 4,
    })
    const newBlock3 = new Block({
      timestamp: Date.now(),
      lastHash: '2222222222',
      hash: '3333333333',
      data: data3,
      nonce: 3,
      difficulty: 3,
    })

    jest
      .spyOn(Block, 'mineBlock')
      .mockReturnValueOnce(newBlock1)
      .mockReturnValueOnce(newBlock2)
      .mockReturnValueOnce(newBlock3)

    bc.addBlock({ data: data1 })
    bc.addBlock({ data: data2 })
    bc.addBlock({ data: data3 })

    expect(bc.chain[1].lastHash === bc.chain[0].hash)
    expect(bc.chain[2].lastHash === bc.chain[1].hash)
    expect(bc.chain[3].lastHash === bc.chain[2].hash)
  })

  it('invalidates a chain with a corrupt genesis block', () => {
    bc2.chain[0].data = (['Hacked data!'] as unknown) as BlockData

    expect(bc.isValidChain(bc2.chain)).toBe(false)
  })

  it('invalidates a corrupt chain', () => {
    bc2.chain[0].data = Block.genesis().data
    bc2.addBlock({ data: (['Second chain first block'] as unknown) as BlockData })
    bc2.chain[1].data = (['Corrupt data'] as unknown) as BlockData
    blockHashSpy = jest.spyOn(Block, 'blockHash').mockReturnValue('2222222222')

    expect(bc.isValidChain(bc2.chain)).toBe(false)
  })

  it('invalidates a block with jumped difficulty', () => {
    bc2.addBlock({ data: [] as Array<Transaction> })
    const lastBlock = bc2.chain[bc2.chain.length - 1]
    const lastHash = lastBlock.hash
    const timestamp = Date.now()
    const nonce = 0
    const data = [] as Array<Transaction>
    const difficulty = lastBlock.difficulty - 2

    const hash = Block.genHash({ timestamp, lastHash, data, nonce, difficulty })
    const badBlock = new Block({ timestamp, lastHash, hash, data, nonce, difficulty })

    bc2.chain.push(badBlock)

    expect(bc.isValidChain(bc2.chain)).toBe(false)
  })

  it('validates a valid chain', () => {
    const data = (['Second chain first block'] as unknown) as BlockData
    const newBlock1 = new Block({
      timestamp: Date.now(),
      lastHash: 'f1r57-h45h',
      hash: '11111111111',
      data,
      nonce: 1,
      difficulty: 3,
    })

    jest.spyOn(Block, 'mineBlock').mockReturnValue(newBlock1)

    blockHashSpy = jest.spyOn(Block, 'blockHash').mockReturnValue('11111111111')

    bc2.addBlock({ data })

    expect(bc.isValidChain(bc2.chain)).toBe(true)
    expect(errorMock).toHaveBeenCalledTimes(0)
  })

  it('replaces the chain with a valid chain', () => {
    const data = (['Second chain first block'] as unknown) as BlockData
    const newBlock1 = new Block({
      timestamp: Date.now(),
      lastHash: 'f1r57-h45h',
      hash: '11111111111',
      data,
      nonce: 1,
      difficulty: 3,
    })

    jest.spyOn(Block, 'mineBlock').mockReturnValue(newBlock1)

    blockHashSpy = jest.spyOn(Block, 'blockHash').mockReturnValue('11111111111')

    bc2.addBlock({ data })

    bc.replaceChain(bc2.chain)

    expect(bc.chain).toStrictEqual(bc2.chain)
    expect(errorMock).toHaveBeenCalledTimes(0)
    expect(logMock).toHaveBeenCalledTimes(1)
  })

  it('does not replace the chain with one of less than or equal to length', () => {
    bc.addBlock({ data: (['First block'] as unknown) as BlockData })

    bc.replaceChain(bc2.chain)

    expect(bc.chain).not.toStrictEqual(bc2.chain)
    expect(errorMock).toHaveBeenCalledTimes(1)
  })
})
