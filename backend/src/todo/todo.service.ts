import List from '../list/list.model'
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
export const addTodo = async ({
  text,
  listId,
  dateId,
}: {
  text: string
  listId?: number
  dateId?: number
}) => {
  const newTodo = await db.todo.create({
    data: {
      text,
    },
  })

  if (listId) {
    const updatedList = await db.list.update({
      where: {
        id: listId,
      },
      data: {
        todos: {
          connect: {
            id: newTodo.id,
          },
        },
        todoOrder: {
          push: newTodo.id,
        },
      },
    })
  }

  return newTodo
}

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

export const deleteTodo = async ({
  id,
  listId,
}: {
  id: number
  listId?: number
}) => {
  const deletedTodo = await db.todo.delete({
    where: {
      id,
    },
  })

  const { todoOrder } = (await db.list.findUnique({
    where: {
      id: listId,
    },
  })) as List

  if (listId) {
    const deleteTodoFromListOrder = await db.list.update({
      where: {
        id: listId,
      },
      data: {
        todoOrder: {
          set: todoOrder.filter((id) => id !== deletedTodo.id),
        },
      },
    })
  }

  return deletedTodo
}
