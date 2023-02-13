import { IoHome } from 'react-icons/io5'
import SwiperCore from 'swiper'
import {
  getInitialDateColumns,
  transformDateSlashToDash,
} from '@/helper/dateHelper'
import useDayStore from '@/stores/dateColumns'
import useDateColumnQuery from '@/hooks/react-query-hooks/useDateColumnQuery'
import Arrow from '../Common/Arrow'

interface Props {
  navigationDisabled: boolean
  swiperRef: SwiperCore | undefined
}

const NavLeft = ({ navigationDisabled, swiperRef }: Props) => {
  const dateColumnStore = useDayStore()
  const { refetch } = useDateColumnQuery(
    getInitialDateColumns().map((col) => col.id),
    { enabled: false },
  )

  const handleHomeClick = async () => {
    // need to replace '/' to '-' (date format: month-day-year)
    const today = transformDateSlashToDash(new Date().toLocaleDateString())
    const todayIndex = dateColumnStore.dateColumns
      .map((col) => col.id)
      .indexOf(today)
    if (todayIndex !== -1) {
      // current day is currently on the DOM tree -> within reach
      swiperRef?.slideTo(todayIndex, 600)
    } else {
      // current day is not on the DOM tree -> out of reach
      dateColumnStore.setColumns(getInitialDateColumns())
      refetch()
    }
  }

  return (
    <nav className="z-30 md:w-16 absolute md:static top-14 left-2 flex flex-col items-center pt-2 md:border-r border-stone-200">
      <Arrow
        left
        navigationDisabled={navigationDisabled}
        onClick={(e: any) => e.stopPropagation() || swiperRef?.slidePrev()}
      />
      <button
        type="button"
        onClick={handleHomeClick}
        className="mt-2 text-xl text-gray-400 hover:text-primary transition-all duration-300"
      >
        <IoHome />
      </button>
    </nav>
  )
}

export default NavLeft
