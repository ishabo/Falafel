import Blockchain from '@falafel/blockchain'
import TransactionPool from './transaction-pool'
import Transaction from './transaction'
import Wallet from '.'

describe('TransactionPool', () => {
  let transactionPool: TransactionPool
  let transaction: Transaction
  let wallet: Wallet
  let blockchain: Blockchain

  const recipient = 'r4nd-4adr355'
  const amount = 30

  beforeEach(() => {
    blockchain = new Blockchain()
    transactionPool = new TransactionPool()
    wallet = new Wallet()
    transaction = wallet.createTransaction(recipient, amount, blockchain, transactionPool) as Transaction
  })

  it('adds a transaction to the pool', () => {
    expect(transactionPool.transactions.find((t) => t.id === transaction.id)).toStrictEqual(
      transaction
    )
  })

  it('updates a transaction in the pool', () => {
    const oldTransaction = JSON.stringify(transaction)
    const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40)
    transactionPool.updateOrAddTransaction(newTransaction)

    expect(
      JSON.stringify(transactionPool.transactions.find((t) => t.id === newTransaction.id))
    ).not.toStrictEqual(oldTransaction)
  })

  it('clears transactions', () => {
    transactionPool.clear()
    expect(transactionPool.transactions).toStrictEqual([])
  })
  describe('mixing valid and corrupt transaction', () => {
    let validTransactions: Array<Transaction>

    beforeEach(() => {
      validTransactions = [...transactionPool.transactions]
      for (let i = 0; i < 6; i++) {
        wallet = new Wallet()
        transaction = wallet.createTransaction(recipient, amount, blockchain, transactionPool) as Transaction
        if (i % 2 === 0) {
          transaction.input.amount = 99999 // corrupt transaction
        } else {
          validTransactions.push(transaction)
        }
      }
    })

    it('shows a difference between valid and corrupt transactions ', () => {
      expect(JSON.stringify(transactionPool.transactions)).not.toStrictEqual(JSON.stringify(validTransactions))
    })

    it ('grabs valid transactions', () => {
      expect(transactionPool.validTransactions()).toStrictEqual(validTransactions)
    })
  })
})
