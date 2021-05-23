import Transaction from './transaction'
import { Chain } from '@falafel/blockchain'

export type TransactionMap = Map<string, Transaction>

class TransactionPool {
  public transactionMap: TransactionMap

  constructor() {
    this.transactionMap = new Map()
  }

  public clear() {
    this.transactionMap.clear()
  }

  public setTransaction(transaction: Transaction) {
    this.transactionMap.set(transaction.id, transaction)
  }

  public setMap(transactionMap: TransactionMap) {
    this.transactionMap = transactionMap
  }

  public existingTransaction({ inputAddress }: { inputAddress: string }) {
    const transactions = Array.from(this.transactionMap.values())

    return transactions.find((transaction) => transaction.input.address === inputAddress)
  }

  public validTransactions() {
    const transactions = Array.from(this.transactionMap.values())
    return transactions.filter(Transaction.validTransaction)
  }

  public clearBlockchainTransactions({ chain }: { chain: Chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i]

      for (let transaction of block.data) {
        console.error(transaction, this.transactionMap.keys())

        if (this.transactionMap.has(transaction.id)) {
          this.transactionMap.delete(transaction.id)
        }
      }
    }
  }
}

export default TransactionPool
