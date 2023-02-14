import List from '../list/list.model'
import { DateColumn } from '../../types/DateColumn'
import db from '../../utils/db'
import Todo from './todo.model'

export const getTodos = async ({
  userId,
  dateColumnIds,
}: {
  userId: string
  dateColumnIds: string[]
}) => {
  const [listCollection, dateColumns] = await db.$transaction([
    db.listCollection.findUnique({
      where: {
        userId,
      },
      include: {
        lists: {
          include: {
            todos: true,
          },
        },
      },
    }),
    db.dateColumn.findMany({
      where: {
        id: {
          in: dateColumnIds,
        },
      },
      include: {
        todos: true,
      },
    }),
  ])

  const listTodos =
    listCollection?.lists
      .map((list) => list.todos)
      .reduce((a, b) => a.concat(b), []) ?? []

  const dateTodos =
    dateColumns.map((date) => date.todos).reduce((a, b) => a.concat(b), []) ??
    []

  return listTodos.concat(dateTodos)
}

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
    await db.list.update({
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
    await db.dateColumn.upsert({
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

    await db.list.update({
      where: {
        id: listId,
      },
      data: {
        todoOrder: {
          set: todoOrder.filter((el) => el !== deletedTodo.id),
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

    await db.dateColumn.update({
      where: {
        id: dateColumnId,
      },
      data: {
        todoOrder: {
          set: todoOrder.filter((el) => el !== deletedTodo.id),
        },
      },
    })
  }

  return deletedTodo
}
