import axiosInstance from '../api'
import { Block } from './types'

const getBlocks = async () => {
  const response = await axiosInstance.get<Array<Block>>('/blocks')

  return response.data
}

export type { Block }
export default getBlocks
