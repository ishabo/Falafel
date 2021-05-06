import Blockchain from '@falafel/blockchain';
import request from 'request'
import {ROOT_NODE_ADDRESS} from './constants';

export const syncChains = (blockchain: Blockchain) => {
  request({url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body);

      console.log('replace chain on a sync with', rootChain)
      blockchain.replaceChain(rootChain)
    }
  })
}

