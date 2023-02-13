import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { editList } from '@/lib/list.service'
import { useMutation, useQueryClient } from 'react-query'

const useEditList = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (data: { listId: number; todoOrder: number[] }) =>
      editList(axiosPrivate, data),
    {
      onSuccess: () => queryClient.invalidateQueries('listCollection'),
    },
  )

  return mutation
}

export default useEditList
