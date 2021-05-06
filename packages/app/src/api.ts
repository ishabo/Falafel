import { Router, Request, Response } from 'express'
import Blockchain from '@falafel/blockchain'
import Wallet, { TransactionPool } from '@falafel/wallet'
import Miner from './miner'
import PubSub from './pubsub'
import RedisPubSub from './pubsub/redisPubSub'


const ApiRouter = ({ blockchain, transactionPool, wallet}:{blockchain: Blockchain, transactionPool: TransactionPool, wallet: Wallet}) => {
  const pubSubService = new RedisPubSub({ redisUrl: 'http://localhost:6379' })
  const pubsub = new PubSub({blockchain, transactionPool, pubSubService })
  const miner = new Miner(blockchain, transactionPool, wallet, pubsub)
  const api = Router()

  api.get('/blocks', (_: Request, res: Response) => {
      res.json(blockchain.chain)
  })

  api.post('/mine', (req: Request, res: Response) => {
      const block = blockchain.addBlock(req.body.data)
      console.log(`New block added: ${block.toString()}`)

      pubsub.broadcastChain()
      res.redirect('/api/blocks')
  })

  api.get('/mine-transactions', (_: Request, res: Response) => {
    const block = miner.mine()
    console.log(`New block added: ${block.toString()}`)

    res.redirect('/api/blocks')
  })

  api.get('/transactions', (_: Request, res: Response) => {
    res.json(transactionPool.transactions)
  })

  api.get('/public-key', (_: Request, res: Response) => {
    res.json({ publicKey: wallet.publicKey })
  })

  api.post('/transact', (req: Request, res: Response) => {
    const { recipient, amount } = req.body
    const transaction = wallet.createTransaction(recipient, amount, blockchain, transactionPool)
    if (transaction) {
      pubsub.broadcastTransaction(transaction)
    }
    res.redirect('/api/transactions')
  })

  return api
}


export default ApiRouter
