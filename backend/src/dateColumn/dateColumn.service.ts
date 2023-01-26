import { db } from '../utils/db'

export const getDateColumns = async ({ ids }: { ids: string[] }) =>
  db.dateColumn.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      todos: true,
    },
  })

export const editTodoOrder = async ({
  id,
  todoOrder,
}: {
  id: string
  todoOrder: number[]
}) =>
  db.dateColumn.update({
    where: {
      id,
    },
    data: {
      todoOrder,
    },
  })
