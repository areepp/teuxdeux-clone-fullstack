import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { editTodoOrder } from '@/lib/dateColumn.service'
import useDateColumnStore from '@/stores/dateColumns'
import { useMutation, useQueryClient } from 'react-query'

const useEditDateColumn = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const dateColumnStore = useDateColumnStore()

  const mutation = useMutation(
    (data: { id: string; todoOrder: number[] }) =>
      editTodoOrder(axiosPrivate, data),
    {
      onMutate: async (data) => {
        dateColumnStore.editColumnTodoOrder(data.id, data.todoOrder)
      },
      onSettled: () =>
        queryClient.invalidateQueries([
          'dateColumn',
          dateColumnStore.dateColumns.map((col) => col.id),
        ]),
      onError: () => {},
    },
  )

  return mutation
}

export default useEditDateColumn
