import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { editListOrder } from '@/lib/listCollection.service'
import { useMutation, useQueryClient } from 'react-query'

const useEditListOrder = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (data: number[]) => editListOrder(axiosPrivate, { listOrder: data }),
    {
      onSuccess: () => queryClient.invalidateQueries('listCollection'),
    },
  )

  return mutation
}

export default useEditListOrder
