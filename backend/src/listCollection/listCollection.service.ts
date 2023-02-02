import { db } from '../utils/db'

export const createListCollection = async ({ id }: { id: string }) =>
  db.listCollection.create({
    data: {
      user: {
        connect: {
          id,
        },
      },
    },
  })

export const getListCollection = async ({ userId }: { userId: string }) => {
  const listCollection = await db.listCollection.findUnique({
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
  })

  return listCollection
}

export const editListOrder = async ({
  userId,
  listOrder,
}: {
  userId: string
  listOrder: number[]
}) =>
  db.listCollection.update({
    where: {
      userId,
    },
    data: {
      listOrder,
    },
  })
