import ListCollection from '../listCollection/listCollection.model'
import { db } from '../utils/db'
import List from './list.model'

export const createList = async ({
  userId,
}: {
  userId: string
}): Promise<List> => {
  const newList = await db.list.create({
    data: {
      todoOrder: [],
    },
  })

  const listCollection = await db.listCollection.update({
    where: {
      userId,
    },
    data: {
      listOrder: {
        push: newList.id,
      },
      lists: {
        connect: {
          id: newList.id,
        },
      },
    },
  })

  return newList
}

export const editList = async ({
  id,
  title,
  todoOrder,
}: {
  id: number
  title?: string
  todoOrder?: number[]
}) => {
  if (todoOrder) {
    const listBefore = await db.list.findUnique({
      where: { id },
      include: {
        todos: true,
      },
    })

    const todoIdsBefore = listBefore?.todos.map((todo) => todo.id)
    const todoIdsLengthBefore = todoIdsBefore?.length ?? 0

    // got a new todo from another list, connect it
    if (todoIdsLengthBefore < todoOrder.length) {
      await db.list.update({
        where: {
          id,
        },
        data: {
          todos: {
            connect: {
              id: todoOrder.filter((id) => todoIdsBefore!.indexOf(id) < 0)[0],
            },
          },
        },
      })
    }

    // a todo moved out of the list, disconnect it
    if (todoIdsLengthBefore > todoOrder.length) {
      await db.list.update({
        where: {
          id,
        },
        data: {
          todos: {
            disconnect: {
              id: todoIdsBefore!.filter((id) => todoOrder.indexOf(id) < 0)[0],
            },
          },
        },
      })
    }

    // do nothing when todo is reordered within the same list, just update the todoOrder
  }
  return db.list.update({
    where: {
      id,
    },
    data: {
      title,
      todoOrder,
    },
  })
}

export const deleteList = async ({
  userId,
  listId,
}: {
  userId: string
  listId: number
}): Promise<List> => {
  const deleteAllTodosWithIn = await db.list.update({
    where: {
      id: listId,
    },
    data: {
      todos: {
        deleteMany: {},
      },
    },
  })

  const deletedList = await db.list.delete({
    where: {
      id: listId,
    },
  })

  const { listOrder } = (await db.listCollection.findUnique({
    where: {
      userId,
    },
  })) as ListCollection

  const listCollection = await db.listCollection.update({
    where: {
      userId,
    },
    data: {
      listOrder: {
        set: listOrder.filter((id) => id !== deletedList.id),
      },
    },
  })

  return deletedList
}
