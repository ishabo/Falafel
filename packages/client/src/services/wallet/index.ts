import axiosInstance from '../api'

export const getWalletInfo = async () => {
  const response = await axiosInstance.get('/wallet-info')

  return response.data
}
