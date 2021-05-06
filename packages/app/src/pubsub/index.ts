import Blockchain from '@falafel/blockchain'
import {Transaction, TransactionPool} from '@falafel/wallet'
import {ChannelMessage, CHANNELS, PubSubService} from './pubSubService'
import RedisPubSub from './redisPubSub'

class PubSub {
  public pubSubService: PubSubService
  public blockchain: Blockchain
  public transactionPool: TransactionPool

  constructor({pubSubService, blockchain, transactionPool}: {pubSubService: PubSubService, blockchain: Blockchain, transactionPool: TransactionPool}) {
    this.pubSubService = pubSubService
    this.blockchain = blockchain
    this.transactionPool = transactionPool

    this.pubSubService.onMessageReceived(this.handleMessage.bind(this))
  }

  public handleMessage({channel, message}: ChannelMessage) {
    console.log(`Message received. Channel: ${channel}. Message: ${message}.`);

    const parsedMessage = JSON.parse(message);

    switch(channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage);
        break;
      case CHANNELS.TRANSACTION:
        this.transactionPool.updateOrAddTransaction(parsedMessage);
        break;
      default:
        return;
    }
  }

  public broadcastChain() {
    this.pubSubService.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    });
  }

  public broadcastTransaction(transaction: Transaction) {
    this.pubSubService.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    });
  }
}

export default PubSub
