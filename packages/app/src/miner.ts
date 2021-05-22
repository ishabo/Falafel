import Blockchain, { Block } from '@falafel/blockchain'
import Wallet, { Transaction, TransactionPool } from '@falafel/wallet'
import PubSub from './pubsub'

class Miner {
  constructor(
    public blockchain: Blockchain,
    public transactionPool: TransactionPool,
    public wallet: Wallet,
    public pubsub: PubSub
  ) {}

  public mine(): Block {
    const validTransactions = this.transactionPool.validTransactions()
    validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()))
    const block = this.blockchain.addBlock(validTransactions)
    this.pubsub.broadcastChain()
    this.transactionPool.clear()

    return block
  }
}

export default Miner
