import ListCollection from '../listCollection/listCollection.model'
import { db } from '../utils/db'
import List from './list.model'

export const createList = async ({
  listCollectionId,
}: {
  listCollectionId: number
}): Promise<List> => {
  const newList = await db.list.create({
    data: {
      todoOrder: [],
    },
  })

  const listCollection = await db.listCollection.update({
    where: {
      id: listCollectionId,
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
  listCollectionId,
  listId,
}: {
  listCollectionId: number
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
      id: listCollectionId,
    },
  })) as ListCollection

  const listCollection = await db.listCollection.update({
    where: {
      id: listCollectionId,
    },
    data: {
      listOrder: {
        set: listOrder.filter((id) => id !== deletedList.id),
      },
    },
  })

  return deletedList
}
