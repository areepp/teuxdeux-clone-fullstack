import { db } from '../utils/db'

export const getListCollection = async ({ id }: { id: number }) => {
  const listCollection = await db.listCollection.findUnique({
    where: {
      id,
    },
    include: {
      lists: true,
    },
  })

  return listCollection
}

export const editListOrder = async ({
  id,
  listOrder,
}: {
  id: number
  listOrder: number[]
}) =>
  db.listCollection.update({
    where: {
      id,
    },
    data: {
      listOrder,
    },
  })
