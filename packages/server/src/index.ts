import Blockchain from '@falafel/blockchain'
import Wallet, { TransactionPool } from '@falafel/wallet'
import PubSub from './pubsub'
import RedisPubSub from './pubsub/redisPubSub'
import TransactionMiner from './transaction-miner'
import express from 'express'
import cors from 'cors'
import ApiRouter from './api'
import { DEFAULT_PORT } from './constants'
import { syncWithRootState } from './utils'
import seedData from './seed'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const blockchain = new Blockchain()
const wallet = new Wallet()
const transactionPool = new TransactionPool()
const pubSubService = new RedisPubSub({ redisUrl: 'http://localhost:6379' })
const pubsub = new PubSub({ blockchain, transactionPool, pubSubService, wallet })
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub })

seedData({ mainWallet: wallet, blockchain, transactionPool, transactionMiner })

app.use('/api', ApiRouter({ blockchain, transactionPool, wallet, transactionMiner, pubsub }))

let PEER_PORT

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000)
}

const PORT = PEER_PORT || DEFAULT_PORT

app.listen(PORT, () => {
  // find a way to re-sync the root node with the network if it gets closed
  if (PORT !== DEFAULT_PORT) {
    syncWithRootState(blockchain, transactionPool)
  }
  console.log(`Listening on port ${PORT}`)
})
