import { AxiosInstance } from 'axios'

export const createList = async (axiosPrivate: AxiosInstance) =>
  axiosPrivate.post('/lists')

export const deleteList = async (
  axiosPrivate: AxiosInstance,
  { listId }: { listId: number },
) => axiosPrivate.delete(`/lists/${listId}`)

export const editList = async (
  axiosPrivate: AxiosInstance,
  {
    listId,
    title,
    todoOrder,
  }: { listId: number; title?: string; todoOrder?: number[] },
) => axiosPrivate.patch(`/lists/${listId}`, { title, todoOrder })
