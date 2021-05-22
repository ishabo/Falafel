import Blockchain from '@falafel/blockchain'
import { Transaction, TransactionPool } from '@falafel/wallet'
import request from 'request'
import { ROOT_NODE_ADDRESS } from './constants'

export const syncWithRootState = (blockchain: Blockchain, transactionPool: TransactionPool) => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body)

      console.log('replace chain on a sync with', rootChain)
      blockchain.replaceChain(rootChain)
    }
  })

  request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootTransactionPoolMap = JSON.parse(body)

      console.log('replace transaction pool map on a sync with', rootTransactionPoolMap)
      transactionPool.setMap(objToMap<Transaction>(rootTransactionPoolMap))
    }
  })
}

export const mapToObj = (m: Map<string, unknown>) =>
  Array.from(m).reduce((obj, [key, value]) => {
    obj[key] = value
    return obj
  }, {} as Record<string, unknown>)

export const objToMap = <T = unknown>(obj: Record<string, T>) => {
   const keys = Object.keys(obj);
   const map = new Map<string, T>()
   for(let i = 0; i < keys.length; i++){
      map.set(keys[i], obj[keys[i]])
   }
   return map
};
