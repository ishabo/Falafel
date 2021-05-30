import axiosInstance from '../api'

export const transact = async ({ recipient, amount } : {recipient: string; amount: number}) => {
  const response = await axiosInstance.post('/transact', { recipient, amount })

  return response.data
}

export default transact

