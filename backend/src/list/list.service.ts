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
}) =>
  db.list.update({
    where: {
      id,
    },
    data: {
      title,
      todoOrder,
    },
  })

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
