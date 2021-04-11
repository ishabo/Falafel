import Transaction from './transaction'

class TransactionPool {

  public transactions: Array<Transaction>

  constructor() {
    this.transactions = [] 
  }

  public updateOrAddTransaction(transaction: Transaction) {
    let transactionWithId = this.transactions.find(({ id  }) => id === transaction.id)

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction
    } else {
      this.transactions.push(transaction)
    }
  }

  public existingTransaction(address: string): Transaction | undefined {
    return this.transactions.find(t => t.input.address === address)
  }
}

export default TransactionPool
