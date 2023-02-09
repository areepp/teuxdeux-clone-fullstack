import List from '../list/list.model'
import { DateColumn } from '../../types/DateColumn'
import { db } from '../../utils/db'
import Todo from './todo.model'

export const getTodos = async (): Promise<Todo[]> => db.todo.findMany()

// TODO: Make Id required
export const addTodo = async ({
  text,
  listId,
  dateColumnId,
}: {
  text: string
  listId?: number
  dateColumnId?: string
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

  if (dateColumnId) {
    const updatedDateColumn = await db.dateColumn.upsert({
      where: {
        id: dateColumnId,
      },
      update: {
        todos: {
          connect: {
            id: newTodo.id,
          },
        },
        todoOrder: {
          push: newTodo.id,
        },
      },
      create: {
        id: dateColumnId,
        todos: {
          connect: {
            id: newTodo.id,
          },
        },
        todoOrder: {
          set: [newTodo.id],
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
  dateColumnId,
}: {
  id: number
  listId?: number
  dateColumnId?: string
}) => {
  const deletedTodo = await db.todo.delete({
    where: {
      id,
    },
  })

  if (listId) {
    const { todoOrder } = (await db.list.findUnique({
      where: {
        id: listId,
      },
    })) as List

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

  if (dateColumnId) {
    const { todoOrder } = (await db.dateColumn.findUnique({
      where: {
        id: dateColumnId,
      },
    })) as DateColumn

    const deleteTodoFromDateColumnOrder = await db.dateColumn.update({
      where: {
        id: dateColumnId,
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
