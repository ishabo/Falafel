import Transaction from './transaction'

class TransactionPool {
  public transactions: Array<Transaction>

  constructor() {
    this.transactions = []
  }

  public updateOrAddTransaction(transaction: Transaction) {
    let transactionWithId = this.transactions.find(({ id }) => id === transaction.id)

    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction
    } else {
      this.transactions.push(transaction)
    }
  }

  public existingTransaction(address: string): Transaction | undefined {
    return this.transactions.find((t) => t.input.address === address)
  }

  public validTransactions() {
    return this.transactions.filter((transaction) => {
      const outputTotal = transaction.outputs.reduce((total, output) => {
        return total + output.amount
      }, 0)

      if (transaction.input.amount !== outputTotal) {
        console.log(`Invalid transaction from ${transaction.input.address}.`)
        return
      }

      if (!Transaction.verifyTransaction(transaction)) {
        console.log(`Invalid signature from ${transaction.input.address}.`)
        return
      }

      return transaction
    })
  }

  public clear() {
    this.transactions = []
  }
}

export default TransactionPool
