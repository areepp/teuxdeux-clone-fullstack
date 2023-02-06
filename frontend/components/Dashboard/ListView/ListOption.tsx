import MyOutsideClickHandler from '@/components/Common/MyOutsideClickHandler'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import * as listService from '@/lib/list.service'
import { useState } from 'react'
import { TbDotsVertical } from 'react-icons/tb'
import { TfiTrash } from 'react-icons/tfi'
import { useMutation, useQueryClient } from 'react-query'

interface Props {
  listId: number
}

const ListOption = ({ listId }: Props) => {
  const queryClient = useQueryClient()
  const [isOptionOpen, setIsOptionOpen] = useState(false)
  const axiosPrivate = useAxiosPrivate()
  const { mutate } = useMutation(
    () => listService.deleteList(axiosPrivate, { listId }),
    {
      onSuccess: () => queryClient.invalidateQueries('listCollection'),
    },
  )

  const handleDeleteList = async () => {
    // eslint-disable-next-line no-alert
    const confirmWindow = window.confirm(
      'Eits bentar... Are you sure about this?\n\nDeleting this list will also delete all to-dos within it.',
    )
    if (confirmWindow) {
      return mutate()
    }
    return undefined
  }

  return (
    <div className="relative left-14 md:left-0">
      <button
        type="button"
        onClick={() => setIsOptionOpen(!isOptionOpen)}
        className="mt-20 flex justify-start py-1 rounded text-xl hover:bg-zinc-300 transition-all"
      >
        <TbDotsVertical />
      </button>
      {isOptionOpen && (
        <MyOutsideClickHandler onOutsideClick={() => setIsOptionOpen(false)}>
          <div className="absolute left-0 top-8 rounded-xl shadow bg-white overflow-hidden">
            <button
              type="button"
              onClick={handleDeleteList}
              className="flex items-center px-3 py-2 hover:bg-zinc-50"
            >
              <TfiTrash />
              <span className="ml-2 md:text-sm">Delete</span>
            </button>
          </div>
        </MyOutsideClickHandler>
      )}
    </div>
  )
}

export default ListOption
