import { INITIAL_BALANCE } from '@falafel/constants'
import Util from '@falafel/util'
import Blockchain from '@falafel/blockchain'
import Transaction from './transaction'
import TransactionPool from './transaction-pool'

class Wallet {
  public balance: number = INITIAL_BALANCE
  public publicKey: string
  private keyPair = Util.genKeyPair()

  constructor() {
    this.publicKey = this.keyPair.getPublic('hex')
  }

  public toString() {
    return `Wallet -
      publicKey: ${this.publicKey.toString()}
      balance  : ${this.balance}
    `
  }

  public sign(dataHash: string) {
    return this.keyPair.sign(dataHash)
  }

  public createTransaction(recipient: string, amount: number, blockchain: Blockchain, transactionPool: TransactionPool) {
    this.balance = this.calculateBalance(blockchain)

    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`)
      return
    }

    let transaction = transactionPool.existingTransaction(this.publicKey)

    if (transaction) {
      transaction.update(this, recipient, amount)
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount)
      if (transaction) {
        transactionPool.updateOrAddTransaction(transaction)
      }
    }

    return transaction
  }

  public calculateBalance(blockchain: Blockchain) {
    let balance: number = this.balance
    let transactions: Array<Transaction> = []

    blockchain.chain.forEach(block => {
      const { data } = block
      if (Array.isArray(data) && data[0] instanceof Transaction) {
        (data as unknown as Array<Transaction>).forEach(transaction => transactions.push(transaction))
      }
    })

    const walletInputTransactions = transactions.filter(transaction => transaction.input.address === this.publicKey)

    let startTime = 0

    if (walletInputTransactions.length > 0) {
      const recentInputTransaction = walletInputTransactions.reduce((prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current)

      balance = Number(recentInputTransaction.outputs.find(output => output.address === this.publicKey)?.amount)
      startTime = recentInputTransaction.input.timestamp
    }
    
    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime) {
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) {
            balance += output.amount
          }
        })
      }
    })

    return balance
  }

  static blockchainWallet() {
    const blockchainWallet = new this()
    // blockchainWallet.address = 'blockchain-wallet'

    return blockchainWallet
  }
}

export { Transaction, TransactionPool }
export default Wallet
