import Block, { BlockData } from './block'
import Wallet, { Transaction } from '@falafel/wallet'
import Util from '@falafel/util'
import { REWARD_INPUT, MINING_REWARD } from '@falafel/constants'

export type Chain = Array<Block>

class Blockchain {
  chain: Chain

  constructor() {
    this.chain = [Block.genesis()]
  }

  addBlock({ data }: { data: BlockData }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    })

    this.chain.push(newBlock)
  }

  replaceChain(chain: Chain, validateTransactions: boolean, onSuccess?: () => void) {
    if (chain.length <= this.chain.length) {
      console.error('The incoming chain must be longer')
      return
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error('The incoming chain must be valid')
      return
    }

    if (validateTransactions && !this.validTransactionData({ chain })) {
      console.error('The incoming chain has invalid data')
      return
    }

    if (onSuccess) onSuccess()
    console.log('replacing chain with', chain)
    this.chain = chain
  }

  public validTransactionData({ chain }: { chain: Chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]
      const transactionSet = new Set()
      let rewardTransactionCount = 0

      for (let transaction of block.data) {
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount += 1

          if (rewardTransactionCount > 1) {
            console.error('Miner rewards exceed limit')
            return false
          }

          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error('Miner reward amount is invalid')
            return false
          }
        } else {
          if (!Transaction.validTransaction(transaction)) {
            console.error('Invalid transaction')
            return false
          }

          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.input.address,
          })

          if (transaction.input.amount !== trueBalance) {
            console.error('Invalid input amount', transaction, trueBalance)
            return false
          }

          if (transactionSet.has(transaction)) {
            console.error('An identical transaction appears more than once in the block')
            return false
          } else {
            transactionSet.add(transaction)
          }
        }
      }
    }

    return true
  }

  static isValidChain(chain: Chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i]
      const actualLastHash = chain[i - 1].hash
      const lastDifficulty = chain[i - 1].difficulty

      if (lastHash !== actualLastHash) return false

      const validatedHash = Util.genHash(timestamp, lastHash, data, nonce, difficulty)

      if (hash !== validatedHash) return false

      if (Math.abs(lastDifficulty - difficulty) > 1) return false
    }

    return true
  }
}

export { Block, BlockData }

export default Blockchain
