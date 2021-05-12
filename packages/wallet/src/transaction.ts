import Util, { Signature } from '@falafel/util'
import Wallet from '.'
import { MINING_REWARD, REWARD_INPUT } from '@falafel/constants'

export type OutputMap = Record<string, number>

export interface Input {
  timestamp: number
  amount: number
  address: string
  signature: Signature
}

type TransactionProps = {
  senderWallet: Wallet
  recipient: string
  amount: number
  outputMap?: OutputMap
  input?: Input
} 

class Transaction {
  public id: string
  public outputMap: OutputMap
  public input: Input

  constructor({ senderWallet, recipient, amount, outputMap, input }: TransactionProps) {
    this.id = Util.id()
    this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount })
    this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap })
  }

  public createInput({
    senderWallet,
    outputMap,
  }: {
    senderWallet: Wallet
    outputMap: OutputMap
  }): Input {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap),
    }
  }

  public createOutputMap({ senderWallet, recipient, amount }: TransactionProps) {
    const outputMap: OutputMap = {}

    outputMap[recipient] = amount
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount

    return outputMap
  }

  public update({ senderWallet, recipient, amount }: TransactionProps): void {
    if (amount > this.outputMap[senderWallet.publicKey]) {
      throw new Error('Amount exceeds balance')
    }

    if (!this.outputMap[recipient]) {
      this.outputMap[recipient] = amount
    } else {
      this.outputMap[recipient] = this.outputMap[recipient] + amount
    }

    this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap })
  }

  static rewardTransaction({ minerWallet }: { minerWallet: Wallet }) {
    return new this({
      input: REWARD_INPUT as Input,
      outputMap: { [minerWallet.publicKey]: MINING_REWARD },
    } as TransactionProps)
  }

  static validTransaction(transaction: Transaction) {
    const { input: { address, amount, signature }, outputMap } = transaction;

    const outputTotal = Object.values(outputMap)
      .reduce((total, outputAmount) => total + outputAmount);

    if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`);
      return false;
    }

    if (!Util.verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.error(`Invalid signature from ${address}`);
      return false;
    }

    return true;  
  }
}

export default Transaction
