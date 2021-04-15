import { INITIAL_BALANCE } from '@falafel/constants'
import Blockchain, { Block, BlockData } from '@falafel/blockchain'
import Transaction from './transaction'
import TransactionPool from './transaction-pool'
import Wallet from '.'

describe('Wallet', () => {
  let blockchain: Blockchain
  let wallet: Wallet
  let transactionPool: TransactionPool

  beforeEach(() => {
    blockchain = new Blockchain()
    wallet = new Wallet()
    transactionPool = new TransactionPool()
  })

  describe('creating a transaction', () => {
    let transaction: Transaction
    let sendAmount: number
    let recipient: string

    beforeEach(() => {
      sendAmount = 50
      recipient = 'r4nd0m-4ddr355'
      transaction = wallet.createTransaction(recipient, sendAmount, blockchain, transactionPool) as Transaction
    })

    describe('and doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, blockchain, transactionPool)
      })

      it('doubles the `sendAmount` subtracted from the wallet balance', () => {
        expect(
          transaction.outputs.find((output) => output.address === wallet.publicKey)?.amount
        ).toStrictEqual(wallet.balance - sendAmount * 2)
      })

      it('clones the `sendAmount` output for the recipient', () => {
        expect(
          transaction.outputs
            .filter((output) => output.address === recipient)
            .map((output) => output.amount)
        ).toStrictEqual([sendAmount, sendAmount])
      })
    })
  })

  describe('calculate a balance', () => {
    let addBalance: number
    let repeatAdd: number
    let senderWallet: Wallet

    beforeEach(() => {
      senderWallet = new Wallet()
      addBalance = 100
      repeatAdd = 3
      for (let i=0; i < repeatAdd; i++) {
        senderWallet.createTransaction(wallet.publicKey, addBalance, blockchain, transactionPool)
      }

      blockchain.addBlock(transactionPool.transactions as unknown as BlockData)
    })

    it('calculates the balance for blockchain transactions matching the recipient', () => {
      expect(wallet.calculateBalance(blockchain)).toStrictEqual(INITIAL_BALANCE + (addBalance * repeatAdd))
    })

    it('calculates the balance for the blockchain transactions matching the sender', () => {
      expect(senderWallet.calculateBalance(blockchain)).toStrictEqual(INITIAL_BALANCE - (addBalance * repeatAdd))
    })

    describe('and the recipient conducts a transaction', () => {
      let subtractBalance: number 
      let recipientBalance: number
      
      beforeEach(() => {
        transactionPool.clear()
        subtractBalance = 60
        recipientBalance = wallet.calculateBalance(blockchain)
        wallet.createTransaction(senderWallet.publicKey, subtractBalance, blockchain, transactionPool)
        blockchain.addBlock(transactionPool.transactions as unknown as BlockData)
      })

      describe('and the sender sends another transaction to the recipient', () => {
        beforeEach(() => {
          transactionPool.clear()
          senderWallet.createTransaction(wallet.publicKey, addBalance, blockchain, transactionPool)
          blockchain.addBlock(transactionPool.transactions as unknown as BlockData)
        })

        it('calculates the recipient balance only using transactions since its most recent one', () => {
          expect(wallet.calculateBalance(blockchain)).toStrictEqual(recipientBalance - subtractBalance + addBalance)
        })
      })
    })
  })
})
