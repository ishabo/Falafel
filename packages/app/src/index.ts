import express, { Response, Request } from 'express'
import bodyParser from 'body-parser'
import Blockchain from '@3urooba/blockchain'

const HTTP_PORT = process.env.HTTP_PORT || 3001

const app = express()

const bc = new Blockchain()

const bc2 = new Blockchain()

app.use(bodyParser.json())

app.get('/blocks', (req: Request, res: Response) => {
    res.json(bc.chain)
})

app.post('/mine', (req: Request, res: Response) => {
    const block = bc.addBlock(req.body.data)
    console.log(`New block added: ${block.toString()}`)
    res.redirect('/blocks')
})

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`))
