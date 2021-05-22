import Block, { BlockData } from './block'

export type Chain = Array<Block>

class Blockchain {
  public chain: Chain

  constructor() {
    this.chain = [Block.genesis()]
  }

  public addBlock({ data }: { data: BlockData }): Block {
    const lastBlock = this.chain[this.chain.length - 1]
    const block = Block.mineBlock(lastBlock, data)
    this.chain.push(block)

    return block
  }

  public isValidChain(chain: Chain): boolean {
    const hasTheSameGenesisBlock = JSON.stringify(chain[0]) !== JSON.stringify(this.chain[0])
    if (hasTheSameGenesisBlock) {
      return false
    }

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const lastBlock = chain[i - 1]
      const lastDifficulty = lastBlock.difficulty
      if (block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block)) {
        return false
      }

      if (Math.abs(lastDifficulty - block.difficulty) > 1) {
        return false
      }
    }

    return true
  }

  public replaceChain(newChain: Chain, onSuccess?: () => void) {
    if (newChain.length <= this.chain.length) {
      console.error('Received chain is not longer than the current chain.')
      return
    }

    if (!this.isValidChain(newChain)) {
      console.error('The received chain is not valid.')
      return
    }

    if (onSuccess) {
      onSuccess()
    }
    console.log('Replacing blockchain with the new chain.')
    this.chain = newChain
  }
}

export { Block, BlockData }

export default Blockchain
