import Blockchain from '@falafel/blockchain'
import TransactionPool from './transaction-pool'
import Transaction from './transaction'
import Wallet from '.'

describe('TransactionPool', () => {
  let transactionPool: TransactionPool
  let transaction: Transaction
  let senderWallet: Wallet

  beforeEach(() => {
    transactionPool = new TransactionPool()
    senderWallet = new Wallet()
    transaction = new Transaction({
      senderWallet,
      recipient: 'fake-recipient',
      amount: 50,
    })
  })

  describe('setTransaction()', () => {
    it('adds a transaction', () => {
      transactionPool.setTransaction(transaction)

      expect(transactionPool.transactionMap.get(transaction.id)).toBe(transaction)
    })
  })

  describe('existingTransaction()', () => {
    it('returns an existing transaction given an input address', () => {
      transactionPool.setTransaction(transaction)

      expect(transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })).toBe(
        transaction
      )
    })
  })

  describe('validTransactions()', () => {
    let validTransactions: Array<Transaction>
    let errorMock: jest.Mock

    beforeEach(() => {
      validTransactions = []
      errorMock = jest.fn()
      global.console.error = errorMock

      for (let i = 0; i < 10; i++) {
        transaction = new Transaction({
          senderWallet,
          recipient: 'any-recipient',
          amount: 30,
        })

        if (i % 3 === 0) {
          transaction.input.amount = 999999
        } else if (i % 3 === 1) {
          transaction.input.signature = new Wallet().sign('foo')
        } else {
          validTransactions.push(transaction)
        }

        transactionPool.setTransaction(transaction)
      }
    })

    it('returns valid transaction', () => {
      expect(transactionPool.validTransactions()).toEqual(validTransactions)
    })

    it('logs errors for the invalid transactions', () => {
      transactionPool.validTransactions()
      expect(errorMock).toHaveBeenCalled()
    })
  })

  describe('clear()', () => {
    it('clears the transactions', () => {
      transactionPool.clear()

      expect(transactionPool.transactionMap.size).toStrictEqual(0)
    })
  })

  describe('clearBlockchainTransactions()', () => {
    it('clears the pool of any existing blockchain transactions', () => {
      const blockchain = new Blockchain()
      const expectedTransactionMap = new Map<string, Transaction>()

      for (let i = 0; i < 6; i++) {
        const transaction = new Wallet().createTransaction({
          recipient: 'foo',
          amount: 20,
        })

        transactionPool.setTransaction(transaction)

        if (i % 2 === 0) {
          blockchain.addBlock({ data: [transaction] })
        } else {
          expectedTransactionMap.set(transaction.id, transaction)
        }
      }

      transactionPool.clearBlockchainTransactions({ chain: blockchain.chain })

      expect(transactionPool.transactionMap).toEqual(expectedTransactionMap)
    })
  })
})
