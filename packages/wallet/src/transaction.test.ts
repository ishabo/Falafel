import { MINING_REWARD } from '@falafel/constants'
import Transaction from './transaction'
import Wallet from '.'

describe('Transaction', () => {
  let transaction: Transaction
  let wallet: Wallet
  let recipient: string
  let amount: number

  beforeEach(() => {
    wallet = new Wallet()
    amount = 50
    recipient = 'r3c1p13nt'
    transaction = Transaction.newTransaction(wallet, recipient, amount) as Transaction
  })

  it('outputs the `amount` subtracted from the wallet balance', () => {
    expect(
      transaction?.outputs.find((output) => output.address === wallet.publicKey)?.amount
    ).toStrictEqual(wallet.balance - amount)
  })

  it('outputs the `amount` added to the recipient', () => {
    expect(
      transaction?.outputs.find((output) => output.address === recipient)?.amount
    ).toStrictEqual(amount)
  })

  it('inputs the balance of the wallet', () => {
    expect(transaction?.input.amount).toStrictEqual(wallet.balance)
  })

  it('validates a valid transaction', () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true)
  })

  it('invalidates a corrupt transaction', () => {
    transaction.outputs[0].amount = 50000

    expect(Transaction.verifyTransaction(transaction)).toBe(false)
  })

  describe('transacting with an amount that exceeds the balance', () => {
    beforeEach(() => {
      amount = 50000
      transaction = Transaction.newTransaction(wallet, recipient, amount) as Transaction
    })

    it('does not create the transaction', () => {
      expect(transaction).toBeUndefined()
    })
  })

  describe('and updating a transaction', () => {
    let nextAmount: number
    let nextRecipient: string

    beforeEach(() => {
      nextAmount = 20
      nextRecipient = 'n3xt-4ddr355'
      transaction = transaction.update(wallet, nextRecipient, nextAmount) as Transaction
    })

    it(`subtracts the next amount from the sender's output`, () => {
      expect(
        transaction.outputs.find((output) => output.address === wallet.publicKey)?.amount
      ).toStrictEqual(wallet.balance - amount - nextAmount)
    })

    it('outputs an amount for the next recipient', () => {
      expect(
        transaction.outputs.find((output) => output.address === nextRecipient)?.amount
      ).toStrictEqual(nextAmount)
    })
  })

  describe('creating a reward transaction', () => {
    beforeEach(() => {
      transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet())
    })

    it(`reward the miner's wallet`, () => {
      expect(transaction.outputs.find(outputs => outputs.address === wallet.publicKey)?.amount).toStrictEqual(MINING_REWARD)
    })
  })
})
