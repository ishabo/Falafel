import Util from '@dahab/util'
import Wallet from '.'

interface Output {
  amount: number
  address: string
}

class Transaction {
  public id: string
  public outputs: Array<Output>
  public input: any

  constructor() {
    this.id = Util.id()
    this.input = null
    this.outputs = []
  }

  public update(senderWallet: Wallet, recipient: string, amount: number): Transaction {
    const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey)
    if (!senderOutput) {
      console.log(`Could not find output maching the senderWallet.publicKey`)
      return this
    }

    if (amount > senderOutput?.amount) {
      console.log(`Amount: ${amount} exceeds the balance.`)
      return this
    }

    senderOutput.amount = senderOutput.amount - amount
    this.outputs.push({ amount, address: recipient })
    Transaction.signTransaction(this, senderWallet)
    return this
  }

  static newTransaction(
    senderWallet: Wallet,
    recipient: string,
    amount: number
  ): Transaction | undefined {
    const transaction = new this()

    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance.`)
      return
    }

    const senderUpdatedAmount = {
      amount: senderWallet.balance - amount,
      address: senderWallet.publicKey,
    }

    const recipientAmount = { amount, address: recipient }

    transaction.outputs.push(...[senderUpdatedAmount, recipientAmount])

    Transaction.signTransaction(transaction, senderWallet)

    return transaction
  }

  static signTransaction(transaction: Transaction, senderWallet: Wallet) {
    transaction.input = {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(Util.genHash(transaction.outputs))
    }
  }

  static verifyTransaction({ input, outputs }: Transaction): boolean {
    return Util.verifySignature(input.address, input.signature, Util.genHash(outputs))
  }
}

export default Transaction
