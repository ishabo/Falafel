import express, { Response, Request } from 'express'
import Blockchain from '@dahab/blockchain'
import P2pServer from './p2p-server'
import Wallet, { TransactionPool } from '@dahab/wallet'

const HTTP_PORT = process.env.HTTP_PORT || 3001
const app = express()

const bc = new Blockchain()

const wallet = new Wallet()
const tp = new TransactionPool()

const p2pServer = new P2pServer(bc, tp)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/blocks', (req: Request, res: Response) => {
    res.json(bc.chain)
})

app.post('/mine', (req: Request, res: Response) => {
    const block = bc.addBlock(req.body.data)
    console.log(`New block added: ${block.toString()}`)

    p2pServer.syncChains()
    res.redirect('/blocks')
})

app.get('/transactions', (req: Request, res: Response) => {
  res.json(tp.transactions)
})

app.get('/public-key', (req: Request, res: Response) => {
  res.json({ publicKey: wallet.publicKey })
})

app.post('/transact', (req: Request, res: Response) => {
  const { recipient, amount } = req.body
  const transaction = wallet.createTransaction(recipient, amount, tp)
  if (transaction) {
    p2pServer.broadcastTransaction(transaction)
  }
  res.redirect('/transactions')
})

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`))
p2pServer.listen()
