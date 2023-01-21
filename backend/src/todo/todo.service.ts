import { db } from '../utils/db'
import Todo from './todo.model'

export const getTodos = async (): Promise<Todo[]> => {
  return db.todo.findMany()
}
