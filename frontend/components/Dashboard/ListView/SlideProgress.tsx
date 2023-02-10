import { useQuery } from 'react-query'
import { getListCollection } from '@/lib/listCollection.service'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useSettingStore from '@/stores/settings'

interface Props {
  activeSlideIndex: number
}

const SlideProgress = ({ activeSlideIndex }: Props) => {
  const axiosPrivate = useAxiosPrivate()
  const settingStore = useSettingStore()

  const { data } = useQuery('listCollection', () =>
    getListCollection(axiosPrivate)) // prettier-ignore

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
