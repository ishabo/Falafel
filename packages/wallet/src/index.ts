import { INITIAL_BALANCE } from '@dahab/constants'
import Util from '@dahab/util'
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

  public createTransaction(recipient: string, amount: number, transactionPool: TransactionPool) {
    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceeds current balance: ${this.balance
      }`)
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
}

export {
  Transaction,
  TransactionPool
}
export default Wallet
