import db from '../../utils/db'

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
}) => {
  if (todoOrder) {
    const dateColumnBefore =
      (await db.dateColumn.findUnique({
        where: { id },
      })) ?? (await db.dateColumn.create({ data: { id, todoOrder: [] } }))

    // CONNECT TODO FROM ANOTHER DATECOLUMN
    if (dateColumnBefore!.todoOrder.length < todoOrder.length) {
      await db.dateColumn.update({
        where: {
          id,
        },
        data: {
          todos: {
            connect: {
              id: todoOrder.filter(
                (el) => dateColumnBefore!.todoOrder.indexOf(el) < 0,
              )[0],
            },
          },
        },
      })
    }

    // DISCONNECT TODO THAT MOVED OUT OF THE DATECOLUMN
    if (dateColumnBefore!.todoOrder.length > todoOrder.length) {
      await db.dateColumn.update({
        where: {
          id,
        },
        data: {
          todos: {
            disconnect: {
              id: dateColumnBefore!.todoOrder.filter(
                (el) => todoOrder.indexOf(el) < 0,
              )[0],
            },
          },
        },
      })
    }
  }

  return db.dateColumn.update({
    where: {
      id,
    },
    data: {
      todoOrder,
    },
  })
}
