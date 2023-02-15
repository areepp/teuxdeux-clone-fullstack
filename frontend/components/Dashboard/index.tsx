import { useEffect } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import CalendarView from '@/components/Dashboard/CalendarView'
import onDragEndLogic from '@/helper/onDragEndLogic'
import useDateColumnStore from '@/stores/dateColumns'
import useSettingStore from '@/stores/settings'
import useGetListCollection from '@/hooks/react-query-hooks/list/useGetListCollection'
import useEditListOrder from '@/hooks/react-query-hooks/list/useEditListOrder'
import useEditList from '@/hooks/react-query-hooks/list/useEditList'
import useEditDateColumn from '@/hooks/react-query-hooks/dateColumn/useEditDateColumn'
import ListView from './ListView'
import Setting from './Common/Setting'

const Dashboard = () => {
  const dateColumnStore = useDateColumnStore()
  const settingStore = useSettingStore()

  const { data: listCollection } = useGetListCollection()

  const { mutate: editListOrder } = useEditListOrder()

  const { mutate: editList } = useEditList()

  const { mutate: editDateColumn } = useEditDateColumn()

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
