import Websocket from 'ws'
import Blockchain, { Chain } from '@dahab/blockchain'
import Wallet, { TransactionPool, Transaction } from '@dahab/wallet'

const P2P_PORT = Number(process.env.P2P_PORT || 5001)
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []

enum MessageType {
  CHAIN = 'CHAIN',
  TRANSACTION = 'TRNSACTION'
}

type Message = {
  type: MessageType.CHAIN,
  chain: Chain
} | {
  type: MessageType.TRANSACTION,
  transaction: Transaction
}

class P2pServer {
  private sockets: Array<Websocket> = [];

  constructor(public blockchain: Blockchain, public transactionPool: TransactionPool) {}
  
  public listen(){
    const server = new Websocket.Server({port: P2P_PORT})

    server.on('connection', socket => this.connectSocket(socket))

    this.connectToPeers()

    console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`)
  }

  public syncChains(): void  {
    this.sockets.forEach(this.sendChain.bind(this))
  }

  public broadcastTransaction(transaction: Transaction) {
    this.sockets.forEach(socket => {
      const message: Message = {
        type: MessageType.TRANSACTION,
        transaction
      }

      socket.send(JSON.stringify(message))
    })
  }

  private connectSocket(socket: Websocket): void {
    this.sockets.push(socket)
    console.log('Socket connected')
    
    this.messageHandler(socket)

    this.sendChain(socket)
  }

  private connectToPeers(): void {
    peers.forEach(peer => {
      const socket = new Websocket(peer)

      socket.on('open', () => this.connectSocket(socket))
    })
  }

  private messageHandler(socket: Websocket) {
    socket.on('message', message => {
      const data: Message = JSON.parse(message.toString())

      console.log('data', data)
      
      switch(data.type) {
        case MessageType.CHAIN:
          this.blockchain.replaceChain(data.chain)
          break
        case MessageType.TRANSACTION:
          this.transactionPool.updateOrAddTransaction(data.transaction)
          break
      }

    })
  }

  private sendChain(socket: Websocket): void  {
    const message: Message = { type: MessageType.CHAIN, chain: this.blockchain.chain } 
    socket.send(JSON.stringify(message))
  }

}

export default P2pServer
