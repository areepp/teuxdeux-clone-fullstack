import SwiperCore from 'swiper'
import useSettingStore from '@/stores/settings'
import useGetListCollection from '@/hooks/react-query-hooks/list/useGetListCollection'
import Arrow from '../Common/Arrow'

interface Props {
  swiperRef: SwiperCore | undefined
  activeSlideIndex: number
}

const NavRight = ({ swiperRef, activeSlideIndex }: Props) => {
  const settingStore = useSettingStore()

  const { data } = useGetListCollection()

  return (
    <nav className="z-30 md:w-16 absolute md:static top-14 right-2 flex flex-col items-center pt-2 md:border-l border-stone-200">
      <Arrow
        navigationDisabled={
          activeSlideIndex ===
            data!.listOrder.length - settingStore.slidesPerView ||
          data!.listOrder.length < settingStore.slidesPerView + 1
        }
        onClick={(e: any) => e.stopPropagation() || swiperRef?.slideNext()}
      />
    </nav>
  )
}

export default NavRight
