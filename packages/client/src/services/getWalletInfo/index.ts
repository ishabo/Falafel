import Wallet from '@falafel/wallet'
import axiosInstance from '../api'

const getWalletInfo = async () => {
  const response = await axiosInstance.get('/wallet-info')

  return response.data
}

export type { Wallet }
export default getWalletInfo

