import Websocket from 'ws'
import Blockchain, { Chain } from '@3urooba/blockchain'

const P2P_PORT = Number(process.env.P2P_PORT || 5001)
const peers = process.env.PEERS ? process.env.PEERS.split(',') : []

class P2pServer {
  private sockets: Array<Websocket> = [];
  constructor(public blockchain: Blockchain) {}
  
  public listen(){
    const server = new Websocket.Server({port: P2P_PORT})

    server.on('connection', socket => this.connectSocket(socket))

    this.connectToPeers()

    console.log(`Listening for peer-to-peer connections on: ${P2P_PORT}`)
  }

  public syncChains(): void  {
    this.sockets.forEach(this.sendChain.bind(this))
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
      const data: Chain = JSON.parse(message.toString())

      console.log('data', data)

      this.blockchain.replaceChain(data)
    })
  }

  private sendChain(socket: Websocket): void  {
    socket.send(JSON.stringify(this.blockchain.chain))
  }


}

export default P2pServer
