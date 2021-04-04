import Block, { BlockData } from './block'

class Blockchain {
    public chain: Array<Block>

    constructor() {
        this.chain = [Block.gensis()]
    }

    public addBlock(data: BlockData): Block {
        const lastBlock = this.chain[this.chain.length - 1]
        const block = Block.mineBlock(lastBlock, data)
        this.chain.push(block)

        return block
    }

    public isValidChain(chain: Array<Block>): boolean {
        if (JSON.stringify(chain[0]) !== JSON.stringify(this.chain[0])) {
            return false
        }

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i]
            const lastBlock = chain[i - 1]

            if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) {
                return false
            }
        }

        return true
    }

    public replaceChain(newChain: Array<Block>) {
        if (newChain.length <= this.chain.length) {
            console.log('Received chain is not longer than the current chain.')
            return
        }

        if (!this.isValidChain(newChain)) {
            console.log('The received chain is not valid.')
            return
        }

        console.log('Replacing blockchain with the new chain.')
        this.chain = newChain
    }
}

export default Blockchain
