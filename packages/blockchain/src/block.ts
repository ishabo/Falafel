import Util from '@falafel/util'
import { GENESIS_DATA, MINE_RATE } from '@falafel/constants'
import { Transaction } from '@falafel/wallet'
import hexToBin from 'hex-to-bin'

export type BlockData = Array<Transaction>

type Timestamp = number
type Hash = string

interface BlockProps {
  timestamp: Timestamp
  lastHash: Hash
  hash: Hash
  data: BlockData
  nonce: number
  difficulty: number
}

class Block {
  public timestamp: Timestamp
  public lastHash: Hash
  public hash: Hash
  public data: BlockData
  public nonce: number
  public difficulty: number

  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }: BlockProps) {
    this.timestamp = timestamp
    this.lastHash = lastHash
    this.hash = hash
    this.data = data
    this.nonce = nonce
    this.difficulty = difficulty
  }

  static genesis() {
    return new this(GENESIS_DATA)
  }

  static mineBlock({ lastBlock, data }: { lastBlock: Block; data: Array<Transaction> }) {
    const lastHash = lastBlock.hash
    let hash, timestamp
    let { difficulty } = lastBlock
    let nonce = 0

    do {
      nonce++
      timestamp = Date.now()
      difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp })
      hash = Util.genHash(timestamp, lastHash, data, nonce, difficulty)
    } while (hexToBin(hash).substring(0, difficulty) !== '0'.repeat(difficulty))

    return new this({ timestamp, lastHash, data, difficulty, nonce, hash })
  }

  static adjustDifficulty({
    originalBlock,
    timestamp,
  }: {
    originalBlock: Block
    timestamp: number
  }) {
    const { difficulty } = originalBlock

    if (difficulty < 1) return 1

    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1

    return difficulty + 1
  }
}

export default Block
