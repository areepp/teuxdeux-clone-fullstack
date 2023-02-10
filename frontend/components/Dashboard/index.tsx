import { useEffect } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import * as dateColumnService from '@/lib/dateColumn.service'
import * as listService from '@/lib/list.service'
import * as listCollectionService from '@/lib/listCollection.service'
import CalendarView from '@/components/Dashboard/CalendarView'
import onDragEndLogic from '@/helper/onDragEndLogic'
import useDateColumnStore from '@/stores/dateColumns'
import useSettingStore from '@/stores/settings'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import ListView from './ListView'
import Setting from './Common/Setting'

const Dashboard = () => {
  const dateColumnStore = useDateColumnStore()
  const settingStore = useSettingStore()
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const { data: listCollection } = useQuery('listCollection', () =>
    listCollectionService.getListCollection(axiosPrivate)) // prettier-ignore

  const { mutate: editListOrder } = useMutation(
    (data: number[]) =>
      listCollectionService.editListOrder(axiosPrivate, { listOrder: data }),
    {
      onSuccess: () => queryClient.invalidateQueries('listCollection'),
    },
  )

  const { mutate: editList } = useMutation(
    (data: { listId: number; todoOrder: number[] }) =>
      listService.editList(axiosPrivate, data),
    {
      onSuccess: () => queryClient.invalidateQueries('listCollection'),
    },
  )

  const { mutate: editDateColumn } = useMutation(
    (data: { id: string; todoOrder: number[] }) =>
      dateColumnService.editTodoOrder(axiosPrivate, data),
  )

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth < 768) {
        settingStore.setSlidesPerView(1)
      } else {
        settingStore.setSlidesPerView(settingStore.slidesPerViewBigScreen)
      }
    }
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [settingStore])

  const onDragEnd = async (result: DropResult) => {
    onDragEndLogic({
      result,
      dateColumnStore,
      listCollection: listCollection!,
      editListOrder,
      editList,
      editDateColumn,
    })
  }

  return (
    <main className="flex-auto flex flex-col">
      <Setting />
      <DragDropContext onDragEnd={onDragEnd}>
        <CalendarView />
        <ListView />
      </DragDropContext>
    </main>
  )
}

export default Dashboard
