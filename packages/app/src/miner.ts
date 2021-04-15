import Blockchain, { Block } from '@falafel/blockchain'
import Wallet, { Transaction, TransactionPool } from '@falafel/wallet'
import P2pServer from './p2p-server'

class Miner {
  constructor(public blockchain: Blockchain, public transactionPool: TransactionPool, public wallet: Wallet, public p2pServer: P2pServer) {

  }

  public mine(): Block {
    const validTransactions = this.transactionPool.validTransactions()
    validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()))
    const block = this.blockchain.addBlock(validTransactions)
    this.p2pServer.syncChains()
    this.transactionPool.clear()
    this.p2pServer.broadcastClearTransaction()

    return block
  }
}

export default Miner
