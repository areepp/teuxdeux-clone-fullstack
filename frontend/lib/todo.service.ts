import { ITodo } from '@/types/ITodo'
import { AxiosInstance } from 'axios'

export const getTodos = async (
  axiosPrivate: AxiosInstance,
  { ids }: { ids: string[] },
): Promise<ITodo[]> => {
  try {
    const response = await axiosPrivate.get('/todos', {
      params: {
        ids: ids.join(';'),
      },
    })
    return response.data
  } catch (error: any) {
    return error.response
  }
}

export const addTodo = async (
  axiosPrivate: AxiosInstance,
  body: { text: string; listId?: number; dateColumnId?: string },
) => axiosPrivate.post('/todos', body)

export const deleteTodo = async (
  axiosPrivate: AxiosInstance,
  {
    todoId,
    listId,
    dateColumnId,
  }: { todoId: number; listId?: number; dateColumnId?: string },
) =>
  axiosPrivate.delete(`/todos/${todoId}`, {
    data: { listId, dateColumnId },
  })

export const editTodo = async (
  axiosPrivate: AxiosInstance,
  {
    todoId,
    text,
    checked,
  }: { todoId: number; text?: string; checked?: boolean },
) => axiosPrivate.patch(`/todos/${todoId}`, { text, checked })
