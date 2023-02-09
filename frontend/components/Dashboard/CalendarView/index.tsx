import { useState } from 'react'
import SwiperCore from 'swiper'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getNextFourDates, getPastFourDates } from '@/helper/dateHelper'
import useDateColumnStore from '@/stores/dateColumns'
import useSettingStore from '@/stores/settings'
import DateColumn from './DateColumn'
import NavLeft from './NavLeft'
import NavRight from './NavRight'
import useDateColumnQuery from '@/hooks/useDateColumnQuery'
import { ITodo } from '@/types/ITodo'

const CalendarView = () => {
  const dateColumnStore = useDateColumnStore()
  const settingStore = useSettingStore()
  const [swiperRef, setSwiperRef] = useState<SwiperCore>()
  const [navigationDisabled, setNavigationDisabled] = useState(false)

  const { refetch } = useDateColumnQuery(
    dateColumnStore.dateColumns.map((col) => col.id),
  )

  return (
    <section className="relative bg-white flex-grow min-h-[500px] pt-12 md:pt-4 md:flex">
      <NavLeft swiperRef={swiperRef} navigationDisabled={navigationDisabled} />

      <div className="h-full md:w-main">
        <Swiper
          className="h-full"
          onSwiper={setSwiperRef}
          initialSlide={7} // initial set to the current day
          slidesPerView={settingStore.slidesPerView}
          allowTouchMove={false}
          speed={600}
          // disable navigation on transition so that the "onTransitionEnd" hook properly called
          onSlideChangeTransitionStart={() => setNavigationDisabled(true)}
          onSlideChangeTransitionEnd={() => setNavigationDisabled(false)}
          onTransitionEnd={async (e) => {
            const minusValue = settingStore.slidesPerView + 1
            if (
              e.activeIndex ===
              dateColumnStore.dateColumns.length - minusValue
            ) {
              // add new columns when reaching the end, in this case three elements away
              // from the end of the column array (right navigation)
              const nextFourDates = getNextFourDates(
                dateColumnStore.dateColumns[
                  dateColumnStore.dateColumns.length - 1
                ].id,
              )
              dateColumnStore.pushColumns(nextFourDates)
              refetch()
            }
            // add new columns when reaching the end, in this case
            // the fourth element of the column array (left navigation)
            if (e.activeIndex === 3) {
              const pastFourDays = getPastFourDates(
                dateColumnStore.dateColumns[0].id,
              )
              dateColumnStore.unshiftColumns(pastFourDays.reverse())
              refetch()
            }
          }}
          onSlidesLengthChange={(e) => {
            if (e.activeIndex === 3) {
              // jump to the correct day, instead of staying at the newly created column
              swiperRef?.slideTo(7, 0)
            }
          }}
        >
          {dateColumnStore.dateColumns.map((column, index) => {
            let columnTodos
            if (column.todoOrder.length === 0) {
              // there are no todos in the column
              columnTodos = null
            } else {
              columnTodos = column.todoOrder.map(
                (id) => column!.todos!.find((todo) => todo.id === id) as ITodo,
              )
            }
            return (
              <SwiperSlide key={column.id}>
                <DateColumn
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

      <NavRight swiperRef={swiperRef} navigationDisabled={navigationDisabled} />
    </section>
  )
}

export default CalendarView
