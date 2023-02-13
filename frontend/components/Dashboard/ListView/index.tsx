import { useState } from 'react'
import { IoIosAdd, IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import useSettingStore from '@/stores/settings'
import useGetListCollection from '@/hooks/react-query-hooks/list/useGetListCollection'
import useCreateList from '@/hooks/react-query-hooks/list/useCreateList'
import { IList } from '@/types/IList'
import { ITodo } from '@/types/ITodo'
import ListColumn from './ListColumn'
import NavLeft from './NavLeft'
import NavRight from './NavRight'
import ReOrderListModal from './ReOrderListModal'
import SlideProgress from './SlideProgress'

const ListView = () => {
  const settingStore = useSettingStore()
  const [swiperRef, setSwiperRef] = useState<SwiperCore>()
  const [isListVisible, setIsListVisible] = useState(true)
  const [isReOrderModalVisible, setIsReOrderModalVisible] = useState(false)
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  const { isLoading, isError, data } = useGetListCollection()
  const { mutate } = useCreateList()

  if (isLoading) return <div>loading...</div>

  if (isError || !data) return <div>error</div>

  const handleAddList = async () => mutate()

  return (
    <section className="bg-zinc-50 py-2">
      {/* LIST OPTION */}
      <div className="px-5 flex items-center justify-between">
        {/* TOGGLER */}
        <button
          type="button"
          className="text-3xl text-gray-400 hover:text-primary transition-all duration-300"
          onClick={() => setIsListVisible(!isListVisible)}
        >
          {isListVisible ? <IoMdArrowDropdown /> : <IoMdArrowDropup />}
        </button>

        {/* RE-ORDER LIST BUTTON */}
        <div className="flex items-center">
          <SlideProgress activeSlideIndex={activeSlideIndex} />
          <button
            type="button"
            className="ml-4 px-3 py-1 text-xs rounded bg-zinc-200 hover:bg-zinc-300 transition-all"
            onClick={() => setIsReOrderModalVisible(true)}
          >
            Re-order
          </button>
        </div>

        {isReOrderModalVisible && (
          <ReOrderListModal
            setIsReOrderModalVisible={setIsReOrderModalVisible}
          />
        )}

        {/* ADD NEW LIST BUTTON */}
        <button
          type="button"
          onClick={handleAddList}
          className="text-3xl text-gray-400 hover:text-primary transition-all duration-300"
        >
          <IoIosAdd />
        </button>
      </div>

      {/* LISTS */}
      {isListVisible && (
        <div className="relative flex min-h-[500px]">
          <NavLeft activeSlideIndex={activeSlideIndex} swiperRef={swiperRef} />

          <div className="flex w-full md:w-main">
            <Swiper
              className="w-full"
              onSwiper={setSwiperRef}
              initialSlide={0}
              slidesPerView={settingStore.slidesPerView}
              allowTouchMove={false}
              speed={600}
              onActiveIndexChange={(e) => setActiveSlideIndex(e.activeIndex)}
              onSlidesLengthChange={(e) => {
                if (e.slides.length <= 4) return
                swiperRef?.slideTo(e.slides.length - 3) // swipe when a new list is created
              }}
            >
              {data.listOrder.map((id) => {
                const list = data.lists.find((el) => el.id === id) as IList
                let todos
                if (list.todos.length === 0) todos = null
                todos = list.todoOrder.map((todoId) =>
                  list.todos.find((todo) => todo.id === todoId)) as ITodo[] // prettier-ignore

                return (
                  <SwiperSlide className="w-full" key={list.id}>
                    <ListColumn list={list} todos={todos} key={list.id} />
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>

          <NavRight activeSlideIndex={activeSlideIndex} swiperRef={swiperRef} />
        </div>
      )}
    </section>
  )
}

export default ListView
