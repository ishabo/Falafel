import express, { Response, Request } from 'express'
import Blockchain from '@3urooba/blockchain'
import P2pServer from './p2p-server'

const HTTP_PORT = process.env.HTTP_PORT || 3001

const app = express()

const bc = new Blockchain()
const p2pServer = new P2pServer(bc)

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

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`))
p2pServer.listen()
