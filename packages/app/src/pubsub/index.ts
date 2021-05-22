import Blockchain from '@falafel/blockchain'
import Wallet, { Transaction, TransactionPool } from '@falafel/wallet'
import { ChannelMessage, CHANNELS, PubSubService } from './pubSubService'

class PubSub {
  public pubSubService: PubSubService
  public blockchain: Blockchain
  public transactionPool: TransactionPool
  public wallet: Wallet

  constructor({
    pubSubService,
    blockchain,
    transactionPool,
    wallet,
  }: {
    pubSubService: PubSubService
    blockchain: Blockchain
    transactionPool: TransactionPool
    wallet: Wallet
  }) {
    this.pubSubService = pubSubService
    this.blockchain = blockchain
    this.transactionPool = transactionPool
    this.wallet = wallet

    this.pubSubService.onMessageReceived(this.handleMessage.bind(this))
  }

  public handleMessage({ channel, message }: ChannelMessage) {
    console.log(`Message received. Channel: ${channel}. Message: ${message}.`)

    const parsedMessage = JSON.parse(message)

    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage)
        break
      case CHANNELS.TRANSACTION:
        if (
          !this.transactionPool.existingTransaction({
            inputAddress: this.wallet.publicKey,
          })
        ) {
          this.transactionPool.setTransaction(parsedMessage)
        }
        break
      default:
        return
    }
  }

  public broadcastChain() {
    this.pubSubService.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    })
  }

  public broadcastTransaction(transaction: Transaction) {
    this.pubSubService.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    })
  }
}

export default PubSub
