import { Transaction } from '@falafel/wallet'
import axiosInstance from '../api'

const getTransactionPool = async () => {
  const response = await axiosInstance.get<Record<string, Transaction>>('/transaction-pool-map')

  return response.data
}

export type { Transaction }
export default getTransactionPool

