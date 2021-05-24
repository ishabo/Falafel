import { Router, Request, Response } from 'express'
import Blockchain from '@falafel/blockchain'
import Wallet, { TransactionPool } from '@falafel/wallet'
import TransactionMiner from './transaction-miner'
import PubSub from './pubsub'
import {mapToObj} from './utils'

const ApiRouter = ({
  blockchain,
  transactionPool,
  wallet,
  transactionMiner,
  pubsub
}: {
  blockchain: Blockchain
  transactionPool: TransactionPool
  wallet: Wallet
  transactionMiner: TransactionMiner,
  pubsub: PubSub
}) => {

  const api = Router()

  api.get('/blocks', (_: Request, res: Response) => {
    res.json(blockchain.chain)
  })

  api.get('/blocks/length', (_: Request, res: Response) => {
    res.json(blockchain.chain.length)
  })

  api.get('/blocks/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const { length } = blockchain.chain

    const blocksReversed = blockchain.chain.slice().reverse()

    let startIndex = (id - 1) * 5
    let endIndex = id * 5

    startIndex = startIndex < length ? startIndex : length
    endIndex = endIndex < length ? endIndex : length

    res.json(blocksReversed.slice(startIndex, endIndex))
  })

  api.post('/mine', (req: Request, res: Response) => {
    const { data } = req.body
    blockchain.addBlock(data)

    pubsub.broadcastChain()
    res.redirect('/api/blocks')
  })

  api.get('/mine-transactions', (_: Request, res: Response) => {
    transactionMiner.mineTransactions()

    res.redirect('/api/blocks')
  })

  api.get('/wallet-info', (_: Request, res: Response) => {
    const address = wallet.publicKey

    res.json({
      address,
      balance: Wallet.calculateBalance({ chain: blockchain.chain, address }),
    })
  })

  api.get('/api/known-addresses', (_: Request, res: Response) => {
    const addressMap: Record<string, string> = {}

    for (let block of blockchain.chain) {
      for (let transaction of block.data) {
        const recipient = Object.keys(transaction.outputMap)

        recipient.forEach((recipient) => (addressMap[recipient] = recipient))
      }
    }

    res.json(Object.keys(addressMap))
  })

  api.get('/public-key', (_: Request, res: Response) => {
    res.json({ publicKey: wallet.publicKey })
  })

  api.post('/transact', (req: Request, res: Response) => {
    const { amount, recipient } = req.body

    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey })

    try {
      if (transaction) {
        transaction.update({ senderWallet: wallet, recipient, amount })
      } else {
        transaction = wallet.createTransaction({
          recipient,
          amount,
          chain: blockchain.chain,
        })
      }
    } catch (error) {
      return res.status(400).json({ type: 'error', message: error.message })
    }

    transactionPool.setTransaction(transaction)

    pubsub.broadcastTransaction(transaction)

    res.json({ type: 'success', transaction })
  })

  api.get('/transaction-pool-map', (_: Request, res: Response) => {
    res.json(mapToObj(transactionPool.transactionMap))
  })

  return api
}

export default ApiRouter
