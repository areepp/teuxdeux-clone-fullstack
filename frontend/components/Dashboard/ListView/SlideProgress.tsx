import useSettingStore from '@/stores/settings'
import useGetListCollection from '@/hooks/react-query-hooks/list/useGetListCollection'

interface Props {
  activeSlideIndex: number
}

const SlideProgress = ({ activeSlideIndex }: Props) => {
  const settingStore = useSettingStore()

  const { data } = useGetListCollection()

  if (data!.listOrder.length <= settingStore.slidesPerView) {
    return null
  }

  return (
    <div className="flex gap-2">
      {data?.listOrder.map((list, index) => (
        <div
          key={list}
          className={`${
            activeSlideIndex <= index &&
            index < activeSlideIndex + settingStore.slidesPerView
              ? 'bg-primary'
              : 'bg-gray-400'
          } w-[6px] h-[6px] rounded-full`}
        />
      ))}
    </div>
  )
}

export default SlideProgress
