import { SHA256 } from 'crypto-js'

export type BlockData = string | Record<string, string> | Array<Record<string, string>>
type Timestamp = number
type Hash = string

class Block {
  constructor(
    public timestamp: Timestamp,
    public lastHash: Hash,
    public hash: Hash,
    public data: BlockData
  ) {
  }

  public toString() {
    const timestamp = new Date(this.timestamp)
    return `Block -
          Timestamp: ${timestamp.toISOString()}
          Last Hash: ${this.lastHash.substring(0, 10)}
          Hash     : ${this.hash.substring(0, 10)}
          Data     : ${this.data}`
  }

  static gensis() {
    return new this(new Date(0, 0, 0 ,0).getTime(), '-----', 'f1r57-h45h', [])
  }

  static mineBlock(lastBlock: Block, data: BlockData) {
    const timestamp = Date.now()
    const lastHash = lastBlock.hash
    const hash = Block.genHash(timestamp, lastHash, data)

    return new this(timestamp, lastHash, hash, data)
  }

  static genHash(timestamp: Timestamp, lastHash: Hash, data: BlockData) {
    const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data)
    return SHA256(`${timestamp}${lastHash}${stringifiedData}`).toString()
  }

  static blockHash(block: Block) {
    const { timestamp, lastHash, data } = block
    return Block.genHash(timestamp, lastHash, data)
  }
}

export default Block
