import { AxiosInstance } from 'axios'
import { IListCollection } from '@/types/IListCollection'

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
) => axiosPrivate.patch('/list-collections', body)
