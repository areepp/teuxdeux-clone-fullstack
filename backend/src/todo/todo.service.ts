import { db } from '../utils/db'

interface ITodo {
  id: string
  text: string
  checked: boolean
}

export const getTodos = async (): Promise<ITodo[]> => {
  return db.todo.findMany()
}
