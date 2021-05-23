import Blockchain from '@falafel/blockchain'
import Wallet, { TransactionPool } from '@falafel/wallet'
import express, { Request, Response } from 'express'
import ApiRouter from './api'
import { DEFAULT_PORT } from './constants'
import { syncWithRootState } from './utils'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const blockchain = new Blockchain()
const wallet = new Wallet()
const transactionPool = new TransactionPool()

app.use('/api', ApiRouter({ blockchain, transactionPool, wallet }))

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
