import axiosInstance from '../api'
import { Block } from './types'

export const getBlocks = async () => {
  const response = await axiosInstance.get<Array<Block>>('/blocks')

  return response.data
}
