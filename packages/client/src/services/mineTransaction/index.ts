import axiosInstance from '../api'

export const mineTransaction = async () => {
  const response = await axiosInstance.get('/mine-transactions')

  return response.data
}

export default mineTransaction

