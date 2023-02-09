import { IListCollection } from '@/types/IListCollection'
import { DateColumnStore } from '@/stores/dateColumns'
import { IDateColumn } from '@/types/IDateColumn'
import { IList } from '@/types/IList'
import { AxiosResponse } from 'axios'
import { DropResult } from 'react-beautiful-dnd'
import { UseMutateFunction, useQuery } from 'react-query'

export const onDragEndLogic = ({
  result,
  dateColumnStore,
  listCollection,
  editListOrder,
  editList,
  editDateColumn,
}: {
  result: DropResult
  dateColumnStore: DateColumnStore
  listCollection: IListCollection
  editListOrder: UseMutateFunction<
    AxiosResponse<any, any>,
    unknown,
    number[],
    unknown
  >
  editList: UseMutateFunction<
    AxiosResponse<any, any>,
    unknown,
    {
      listId: number
      todoOrder: number[]
    },
    unknown
  >
  editDateColumn: UseMutateFunction<
    AxiosResponse<any, any>,
    unknown,
    {
      id: string
      todoOrder: number[]
    },
    unknown
  >
}) => {
  const { destination, source, draggableId, type } = result

  if (!destination) return

  // HANDLE LIST RE-ORDER
  if (type === 'list') {
    const newListOrder = Array.from(listCollection.listOrder)
    newListOrder.splice(source.index, 1)
    newListOrder.splice(destination.index, 0, parseInt(draggableId))

    return editListOrder(newListOrder)
  }

  // DO NOTHING IF DRAGGED ITEM POSITION IS NOT CHANGED
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return
  }

  const sourceIsList = source.droppableId.startsWith('list-')
  const destinationIsList = destination.droppableId.startsWith('list-')

  let startColumn: IDateColumn | IList
  let finishColumn: IDateColumn | IList

  // determine whether the destination / source is list column
  // or date column in order to use the correct mutation.

  if (sourceIsList) {
    startColumn = listCollection.lists.find(
      (list) => list.id === parseInt(source.droppableId.split('-').pop()!),
    ) as IList
  } else {
    startColumn = dateColumnStore.dateColumns.find(
      (col) => col.id === source.droppableId,
    ) as IDateColumn
  }

  if (destinationIsList) {
    finishColumn = listCollection.lists.find(
      (list) => list.id === parseInt(destination.droppableId.split('-').pop()!),
    ) as IList
  } else {
    finishColumn = dateColumnStore.dateColumns.find(
      (col) => col.id === destination.droppableId,
    ) as IDateColumn
  }

  if (startColumn === finishColumn) {
    // REORDER TODO WITHIN THE SAME COLUMN
    const newOrder = Array.from(startColumn!.todoOrder)
    newOrder.splice(source.index, 1)
    newOrder.splice(destination.index, 0, parseInt(draggableId))

    if (destinationIsList) {
      editList({ listId: finishColumn.id as number, todoOrder: newOrder })
    } else {
      const newColumn = {
        ...startColumn,
        todoOrder: newOrder,
      } as IDateColumn

      dateColumnStore.editColumnById(newColumn.id as string, newColumn)
      editDateColumn({ id: finishColumn.id as string, todoOrder: newOrder })
    }
  } else {
    // move todo from one column to another
    const newStartOrder = Array.from(startColumn.todoOrder)
    newStartOrder.splice(source.index, 1)

    const newFinishOrder = Array.from(finishColumn.todoOrder)
    newFinishOrder.splice(destination.index, 0, parseInt(draggableId))

    if (sourceIsList) {
      editList({ listId: startColumn.id as number, todoOrder: newStartOrder })
    } else {
      const newStartColumn: IDateColumn = {
        ...startColumn,
        todoOrder: newStartOrder,
        todos: startColumn!.todos!.filter(
          (todo) => todo.id !== parseInt(draggableId),
        ),
      } as IDateColumn

      dateColumnStore.editColumnById(startColumn.id as string, newStartColumn)
      editDateColumn({ id: startColumn.id as string, todoOrder: newStartOrder })
    }

    if (destinationIsList) {
      editList({ listId: finishColumn.id as number, todoOrder: newFinishOrder })
    } else {
      const movedTodo = startColumn!.todos!.filter(
        (todo) => todo.id === parseInt(draggableId),
      )[0]

      const newFinishColumn: IDateColumn = {
        ...finishColumn,
        todoOrder: newFinishOrder,
        todos: finishColumn.todos
          ? [...finishColumn.todos, movedTodo]
          : [movedTodo],
      } as IDateColumn

      dateColumnStore.editColumnById(finishColumn.id as string, newFinishColumn)
      editDateColumn({
        id: finishColumn.id as string,
        todoOrder: newFinishOrder,
      })
    }
  }
}
