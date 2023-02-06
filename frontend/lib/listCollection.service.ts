import { AxiosInstance } from 'axios'
import { IList } from './list.service'
import { ITodo } from './todo.service'

export interface IListCollection {
  id: number
  listOrder: number[]
  userId: string
  lists: IList[]
}

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
