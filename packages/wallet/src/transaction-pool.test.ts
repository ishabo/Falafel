import TransactionPool from './transaction-pool'
import Transaction from './transaction'
import Wallet from '.'

describe('TransactionPool', () => {
  let transactionPool: TransactionPool
  let transaction: Transaction
  let wallet: Wallet 

  beforeEach(() => {
    transactionPool = new TransactionPool()
    wallet = new Wallet()
    transaction = Transaction.newTransaction(wallet, 'r4nd-4adr355', 30) as Transaction
    transactionPool.updateOrAddTransaction(transaction)
  })

  it('adds a transaction to the pool', () => {
    expect(transactionPool.transactions.find(t => t.id === transaction.id)).toStrictEqual(transaction)
  })

  it('updates a transaction in the pool', () => {
      const oldTransaction = JSON.stringify(transaction)
      const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40)
      transactionPool.updateOrAddTransaction(newTransaction)

      expect(JSON.stringify(transactionPool.transactions.find(t => t.id === newTransaction.id))).not.toStrictEqual(oldTransaction)
  })


})
