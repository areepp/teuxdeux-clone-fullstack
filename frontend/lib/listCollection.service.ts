import { IListCollection } from '@/types/IListCollection'
import { AxiosInstance } from 'axios'

export const getListCollection = async (axiosPrivate: AxiosInstance) => {
  try {
    const { data } = await axiosPrivate.get<IListCollection>(
      '/list-collections',
    )
    return data
  } catch (error: any) {
    throw error.response.data
  }
}

export const editListOrder = async (
  axiosPrivate: AxiosInstance,
  body: { listOrder: number[] },
) => {
  return axiosPrivate.patch('/list-collections', body)
}
