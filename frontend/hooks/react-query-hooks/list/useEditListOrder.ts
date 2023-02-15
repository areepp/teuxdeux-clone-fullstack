import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { editListOrder } from '@/lib/listCollection.service'
import { useMutation, useQueryClient } from 'react-query'

const useEditListOrder = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (data: number[]) => editListOrder(axiosPrivate, { listOrder: data }),
    {
      onMutate: async (data) => {
        await queryClient.cancelQueries('listCollection')

        const previousListCollection =
          queryClient.getQueryData('listCollection')

        queryClient.setQueryData('listCollection', (prev: any) => ({
          ...prev,
          listOrder: data,
        }))

        return { previousListCollection }
      },
      onSettled: () => queryClient.invalidateQueries('listCollection'),
      onError: (_error, _data, context) => {
        queryClient.setQueryData(
          'listCollection',
          context?.previousListCollection,
        )
      },
    },
  )

  return mutation
}

export default useEditListOrder
