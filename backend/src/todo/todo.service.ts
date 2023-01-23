import { db } from '../utils/db'
import Todo from './todo.model'

export const getTodos = async (): Promise<Todo[]> => db.todo.findMany()

export const getTodosByIds = async ({ ids }: { ids: number[] }) =>
  db.todo.findMany({
    where: {
      id: { in: ids },
    },
  })

// TODO: Make Id required
export const addTodo = async ({ text }: { text: string }) =>
  db.todo.create({
    data: {
      text,
    },
  })

export const editTodo = async ({ id, text, checked }: Todo) =>
  db.todo.update({
    where: {
      id,
    },
    data: {
      checked,
      text,
    },
  })

export const deleteTodo = async ({ id }: { id: number }) =>
  db.todo.delete({
    where: {
      id,
    },
  })
