import axiosInstance from '../api'

export const getWalletInfo = async () => {
  const response = await axiosInstance.get('/wallet-info')

  return response.data
}

export const transact = async ({ recipient, amount } : {recipient: string; amount: number}) => {
  const response = await axiosInstance.post('/transact', { recipient, amount })

  return response.data
}
