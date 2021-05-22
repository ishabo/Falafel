import Blockchain from '@falafel/blockchain'
import Wallet, { Transaction, TransactionPool } from '@falafel/wallet'
import PubSub from './pubsub'

class TransactionMiner {
  public blockchain: Blockchain
  public transactionPool: TransactionPool
  public wallet: Wallet
  public pubsub: PubSub

  constructor({
    blockchain,
    transactionPool,
    wallet,
    pubsub,
  }: {
    blockchain: Blockchain
    transactionPool: TransactionPool
    wallet: Wallet
    pubsub: PubSub
  }) {
    this.blockchain = blockchain
    this.transactionPool = transactionPool
    this.wallet = wallet
    this.pubsub = pubsub
  }

  public mineTransactions(): void {
    const validTransactions = this.transactionPool.validTransactions()

    validTransactions.push(Transaction.rewardTransaction({ minerWallet: this.wallet }))

    this.blockchain.addBlock({ data: validTransactions })

    this.pubsub.broadcastChain()

    this.transactionPool.clear()
  }
}

export default TransactionMiner
