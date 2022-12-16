import DayColumn from './DayColumn'
import NavLeft from './NavLeft'
import NavRight from './NavRight'
import useDayStore from '@/stores/days'
import { IDayColumn } from '@/stores/days'
import { ITodo } from '@/stores/todos'
import useTodoStore from '@/stores/todos'
import { getNextFourDays, getPastFourDays } from '@/utils/dateHelper'
import { useState } from 'react'
import SwiperCore from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

interface Props {
  syncDayColumns: (_dayColumns: IDayColumn[]) => Promise<void>
}

const CalendarView = ({ syncDayColumns }: Props) => {
  const columnStore = useDayStore()
  const todoStore = useTodoStore()
  const [swiperRef, setSwiperRef] = useState<SwiperCore>()
  const [navigationDisabled, setNavigationDisabled] = useState(false)

  return (
    <section className="relative bg-white flex-grow min-h-[500px] pt-12 md:flex">
      <NavLeft
        swiperRef={swiperRef}
        navigationDisabled={navigationDisabled}
        syncDayColumns={syncDayColumns}
      />

      <div className="h-full md:w-main">
        <Swiper
          className="h-full"
          onSwiper={setSwiperRef}
          initialSlide={7} // initial set to the current day
          slidesPerView={1}
          allowTouchMove={false}
          speed={600}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
          }}
          onSlideChangeTransitionStart={() => setNavigationDisabled(true)}
          onSlideChangeTransitionEnd={() => setNavigationDisabled(false)}
          onTransitionEnd={async (e) => {
            if (e.activeIndex === columnStore.dayColumns.length - 4) {
              const nextFourDays = getNextFourDays(
                columnStore.dayColumns[columnStore.dayColumns.length - 1].id,
              )
              columnStore.pushColumns(nextFourDays)
              await syncDayColumns([...columnStore.dayColumns, ...nextFourDays])
            }
            if (e.activeIndex === 3) {
              const pastFourDays = getPastFourDays(columnStore.dayColumns[0].id)
              columnStore.unshiftColumns(pastFourDays.reverse())
              await syncDayColumns([
                ...pastFourDays.reverse(),
                ...columnStore.dayColumns,
              ])
            }
          }}
          onSlidesLengthChange={(e) => {
            if (e.activeIndex === 3) {
              swiperRef?.slideTo(7, 0)
            }
          }}
        >
          {columnStore.dayColumns.map((column, index) => {
            let columnTodos
            if (column.order.length === 0) {
              // there are no todos in the column
              columnTodos = null
            } else {
              columnTodos = column.order.map(
                (id) => todoStore.todos.find((todo) => todo.id === id) as ITodo,
              )
            }
            return (
              <SwiperSlide key={column.id}>
                <DayColumn
                  todos={columnTodos}
                  column={column}
                  swiperRef={swiperRef}
                  index={index}
                />
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      <NavRight
        swiperRef={swiperRef}
        navigationDisabled={navigationDisabled}
        syncDayColumns={syncDayColumns}
      />
    </section>
  )
}

export default CalendarView