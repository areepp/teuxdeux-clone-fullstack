import * as dayService from '@/lib/day.service'
import * as listService from '@/lib/list.service'
import { IListCollection } from '@/lib/listCollection.service'
import { DayStore } from '@/stores/days'
import { ListStore } from '@/stores/lists'
import { IDayColumn } from '@/types/IDayColumn'
import { IList } from '@/types/IList'
import { AxiosInstance, AxiosResponse } from 'axios'
import { User } from 'firebase/auth'
import { DropResult } from 'react-beautiful-dnd'
import { UseMutateFunction, useQuery } from 'react-query'

export const onDragEndLogic = ({
  result,
  user,
  listStore,
  columnStore,
  listCollection,
  editListOrder,
  editList,
}: {
  result: DropResult
  user: User | null
  listStore: ListStore
  columnStore: DayStore
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
}) => {
  const { destination, source, draggableId, type } = result

  if (!destination) return

  if (type === 'list') {
    // const newListOrder = Array.from(listStore.listOrder)
    const newListOrder = Array.from(listCollection.listOrder)
    newListOrder.splice(source.index, 1)
    newListOrder.splice(destination.index, 0, parseInt(draggableId))

    return editListOrder(newListOrder)
  }

  // do nothing if the position of the dragged item is not changed
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return
  }

  const destinationIsList = destination.droppableId.startsWith('list-')
  const sourceIsList = source.droppableId.startsWith('list-')

  // let startColumn: IDayColumn | IList
  // let finishColumn: IDayColumn | IList

  let startColumn = listCollection.lists.find(
    (list) => list.id === parseInt(source.droppableId.split('-').pop()!),
  ) as IList
  let finishColumn = listCollection.lists.find(
    (list) => list.id === parseInt(destination.droppableId.split('-').pop()!),
  ) as IList

  // determine whether the destination / source is list
  // or calendar in order to use the correct store.

  // if (sourceIsList) {
  //   startColumn = listCollection.lists.find(
  //     (list) => list.id === parseInt(source.droppableId.split('-').pop()!),
  //   ) as IList
  // } else {
  //   startColumn = columnStore.dayColumns.find(
  //     (col) => col.id === source.droppableId,
  //   ) as IDayColumn
  // }

  // if (destinationIsList) {
  //   finishColumn = listCollection.lists.find(
  //     (list) => list.id === parseInt(destination.droppableId.split('-').pop()!),
  //   ) as IList
  // } else {
  //   finishColumn = columnStore.dayColumns.find(
  //     (col) => col.id === destination.droppableId,
  //   ) as IDayColumn
  // }

  if (startColumn === finishColumn) {
    // reorder todo within the same column
    const newOrder = Array.from(startColumn!.todoOrder)
    newOrder.splice(source.index, 1)
    newOrder.splice(destination.index, 0, parseInt(draggableId))

    const newColumn = {
      ...startColumn,
      order: newOrder,
    }

    if (destinationIsList) {
      // listStore.editList(newColumn.id, newColumn as IList)
      editList({ listId: finishColumn.id, todoOrder: newOrder })
    } else {
      // columnStore.editColumnById(newColumn.id, newColumn)
      // dayService.editTodoOrder(user!.uid, finishColumn.id, newOrder)
    }
  } else {
    // move todo from one column to another
    const newStartOrder = Array.from(startColumn.todoOrder)
    newStartOrder.splice(source.index, 1)

    const newStartColumn = {
      ...startColumn,
      order: newStartOrder,
    }

    const newFinishOrder = Array.from(finishColumn.todoOrder)
    newFinishOrder.splice(destination.index, 0, parseInt(draggableId))

    const newFinishColumn = {
      ...finishColumn,
      order: newFinishOrder,
    }

    if (sourceIsList) {
      // listStore.editList(startColumn.id, newStartColumn as IList)
      editList({ listId: startColumn.id, todoOrder: newStartOrder })
    } else {
      // columnStore.editColumnById(startColumn.id, newStartColumn)
      // dayService.editTodoOrder(user!.uid, startColumn.id, newStartOrder)
    }

    if (destinationIsList) {
      // listStore.editList(finishColumn.id, newFinishColumn as IList)
      editList({ listId: finishColumn.id, todoOrder: newFinishOrder })
    } else {
      // columnStore.editColumnById(finishColumn.id, newFinishColumn)
      // dayService.editTodoOrder(user!.uid, finishColumn.id, newFinishOrder)
    }
  }
}
