import { advanceTo, clear } from 'jest-date-mock'

import Blockchain from '.'
import Block from './block'

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
    const data = 'A new block was added'
    const newBlock = new Block(Date.now(), 'f1r57-h45h', 'a1a6da8674', data, 1, 3)
    const mineBlockSpy = jest.spyOn(Block, 'mineBlock').mockReturnValueOnce(newBlock)
    bc.addBlock(data)
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
    const data1 = 'First block'
    const data2 = 'second block'
    const data3 = 'third block'
    const newBlock1 = new Block(Date.now(), 'f1r57-h45h', '11111111111', data1, 1, 3)
    const newBlock2 = new Block(Date.now(), '11111111111', '2222222222', data2, 2, 4)
    const newBlock3 = new Block(Date.now(), '2222222222', '3333333333', data3, 3, 3)

    jest
      .spyOn(Block, 'mineBlock')
      .mockReturnValueOnce(newBlock1)
      .mockReturnValueOnce(newBlock2)
      .mockReturnValueOnce(newBlock3)

    bc.addBlock(data1)
    bc.addBlock(data2)
    bc.addBlock(data3)

    expect(bc.chain[1].lastHash === bc.chain[0].hash)
    expect(bc.chain[2].lastHash === bc.chain[1].hash)
    expect(bc.chain[3].lastHash === bc.chain[2].hash)

  })

  it('validates a valid chain', () => {
    const data = 'Second chain first block'
    const newBlock1 = new Block(Date.now(), 'f1r57-h45h', '11111111111', data, 1, 3)

    jest
      .spyOn(Block, 'mineBlock')
      .mockReturnValue(newBlock1)

    jest.spyOn(Block, 'blockHash').mockReturnValue('11111111111')

    bc2.addBlock(data)

    expect(bc.isValidChain(bc2.chain)).toBe(true)
  })

  it('invalidates a chain with a corrupt genesis block', () => {
    bc2.chain[0].data = 'Hacked data!'

    expect(bc.isValidChain(bc2.chain)).toBe(false)
  })

  it('invalidates a corrupt chain', () => {
    bc2.chain[0].data = Block.genesis().data
    bc2.addBlock('Second chain first block')
    bc2.chain[1].data = 'Corrupt data'
    jest.spyOn(Block, 'blockHash').mockReturnValue('2222222222')

    expect(bc.isValidChain(bc2.chain)).toBe(false)
  })

  it('replaces the chain with a valid chain', () => {
    const data = 'Second chain first block'
    const newBlock1 = new Block(Date.now(), 'f1r57-h45h', '11111111111', data, 1, 3)

    jest
      .spyOn(Block, 'mineBlock')
      .mockReturnValue(newBlock1)

    jest.spyOn(Block, 'blockHash').mockReturnValue('11111111111')

    bc2.addBlock(data)

    bc.replaceChain(bc2.chain)

    expect(bc.chain).toStrictEqual(bc2.chain)
  })

  it('does not replace the chain with one of less than or equal to length', () => {
    bc.addBlock('First block')

    bc.replaceChain(bc2.chain)

    expect(bc.chain).not.toStrictEqual(bc2.chain)
  })
})
