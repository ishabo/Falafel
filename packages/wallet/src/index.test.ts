import Wallet from "."
import Transaction from "./transaction"
import TransactionPool from "./transaction-pool"

describe('Wallet', () => {
  let wallet: Wallet
  let tp: TransactionPool

  beforeEach(() => {
    wallet = new Wallet()
    tp = new TransactionPool()
  })

  describe('creating a transaction', () => {
    let transaction: Transaction
    let sendAmount: number
    let recipient: string

    beforeEach(() => {
      sendAmount = 50
      recipient = 'r4nd0m-4ddr355'
      transaction = wallet.createTransaction(recipient, sendAmount, tp) as Transaction
    })

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, tp)
      })

      it('doubles the `sendAmount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey)?.amount).toStrictEqual(wallet.balance - sendAmount*2)
      })

      it('clones the `sendAmount` output for the recipient', () => {
        expect(transaction.outputs.filter(output => output.address === recipient).map(output => output.amount)).toStrictEqual([sendAmount, sendAmount])
      })
    })

  })
})
