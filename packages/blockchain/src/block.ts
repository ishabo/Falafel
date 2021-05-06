import Util from '@falafel/util'
import { DEFAULT_DIFFICULTY, MINE_RATE } from '@falafel/constants'
import { Transaction } from '@falafel/wallet'
import hex2Bin from 'hex-to-bin'

export type BlockData = Array<Transaction> | string 

type Timestamp = number
type Hash = string

interface BlockProps {
  timestamp: Timestamp
  lastHash: Hash
  hash: Hash
  data: BlockData
  nonce: number
  difficulty?: number
}

class Block {
  public timestamp: Timestamp
  public lastHash: Hash
  public hash: Hash
  public data: BlockData
  public nonce: number
  public difficulty: number

  constructor(
    {timestamp, lastHash, hash, data, nonce, difficulty = DEFAULT_DIFFICULTY} : BlockProps
  ) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
    this.nonce = nonce
    this.difficulty = difficulty
  }

  public toString() {
    const timestamp = new Date(this.timestamp)
    return `Block -
          Timestamp : ${timestamp.toISOString()}
          Last Hash : ${this.lastHash.substring(0, 10)}
          Hash      : ${this.hash.substring(0, 10)}
          Nonce     : ${this.nonce}
          Difficulty: ${this.difficulty}
          Data      : ${this.data}`
  }

  static genesis() {
    return new this(
      {
        timestamp: new Date(0, 0, 0, 0).getTime(),
        lastHash: '-----',
        hash: 'f1r57-h45h',
        data: [] as Array<Transaction>,
        nonce: 0,
      }
    )
  }

  static mineBlock(lastBlock: Block, data: BlockData) {
    let hash: string
    let timestamp: number
    let { difficulty } = lastBlock
    let nonce = 0
    const lastHash = lastBlock.hash

    do {
      nonce++
      timestamp = Date.now()
      difficulty = Block.adjustDifficulty(lastBlock, timestamp)
      hash = Block.genHash(timestamp, lastHash, data, nonce, difficulty)
      // console.log(nonce)
    } while (hex2Bin(hash).substring(0, difficulty) !== '0'.repeat(difficulty))

    return new this({ timestamp, lastHash, hash, data, nonce, difficulty })
  }

  static genHash(
    timestamp: Timestamp,
    lastHash: Hash,
    data: BlockData,
    nonce: number,
    difficulty: number
  ) {
    const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data)
    return Util.genHash(`${timestamp}${lastHash}${stringifiedData}${nonce}${difficulty}`).toString()
  }

  static blockHash(block: Block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block
    return Block.genHash(timestamp, lastHash, data, nonce, difficulty)
  }

  static adjustDifficulty(lastBlock: Block, currentTime: number): number {
    let { difficulty } = { ...lastBlock }
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1
    return difficulty
  }
}

export default Block
