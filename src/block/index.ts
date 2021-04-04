import { SHA256 } from 'crypto-js'

export type BlockData = string | Record<string, string> | Array<Record<string, string>>

class Block {
    constructor(
        public timestamp: Date,
        public lastHash: string,
        public hash: string,
        public data: BlockData
    ) {}

    public toString() {
        return `Block -
          Timestamp: ${this.timestamp}
          Last Hash: ${this.lastHash}
          Hash     : ${this.hash}
          Data     : ${this.data}`
    }

    static gensis() {
        return new this(new Date(), '-----', 'f1r57-h45h', [])
    }

    static mineBlock(lastBlock: Block, data: BlockData) {
        const timestamp = new Date()
        const lastHash = lastBlock.hash
        const hash = Block.hash(timestamp, lastHash, data)

        return new this(timestamp, lastHash, hash, data)
    }

    static hash(timestamp: Date, lastHash: string, data: BlockData) {
        const stringifiedData = typeof data === 'string' ? data : JSON.stringify(data)
        return SHA256(`${timestamp}${lastHash}${stringifiedData}`).toString()
    }
}

export default Block
