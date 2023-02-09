import { AxiosInstance } from 'axios'

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
  }: { todoId: string; text?: string; checked?: boolean },
) => axiosPrivate.patch(`/todos/${todoId}`, { text, checked })
