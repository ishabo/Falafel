import { INITIAL_BALANCE } from '@falafel/constants'
import Util from '@falafel/util'
import { Chain } from '@falafel/blockchain'
import Transaction from './transaction'
import TransactionPool from './transaction-pool'

class Wallet {
  public balance: number = INITIAL_BALANCE
  public publicKey: string
  public keyPair = Util.genKeyPair()

  constructor() {
    this.publicKey = this.keyPair.getPublic('hex')
  }

  public toString() {
    return `Wallet -
      publicKey: ${this.publicKey.toString()}
      balance  : ${this.balance}
    `
  }

  public sign(data: unknown) {
    return this.keyPair.sign(Util.genHash(data))
  }

  createTransaction({ recipient, amount, chain }: { recipient: string, amount: number, chain?: Chain }): Transaction {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey
      });
    }

    if (amount > this.balance) {
      throw new Error('Amount exceeds balance');
    }

    return new Transaction({ senderWallet: this, recipient, amount });
  }

  static calculateBalance({ chain, address }: { chain: Chain, address: string }) {
    let hasConductedTransaction = false;
    let outputsTotal = 0;

    for (let i=chain.length-1; i>0; i--) {
      const block = chain[i];
      const blockData = block.data as unknown as Array<Transaction>

      for (let transaction of blockData) {
        if (transaction.input.address === address) {
          hasConductedTransaction = true;
        }

        const addressOutput = transaction.outputMap[address];

        if (addressOutput) {
          outputsTotal = outputsTotal + addressOutput;
        }
      }

      if (hasConductedTransaction) {
        break;
      }
    }

    return hasConductedTransaction ? outputsTotal : INITIAL_BALANCE + outputsTotal;
  }

  static blockchainWallet() {
    const blockchainWallet = new this()
    // blockchainWallet.address = 'blockchain-wallet'

    return blockchainWallet
  }
}

export { Transaction, TransactionPool }
export default Wallet
