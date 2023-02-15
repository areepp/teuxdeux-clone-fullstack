import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { editList } from '@/lib/list.service'
import { IList } from '@/types/IList'
import { IListCollection } from '@/types/IListCollection'
import { useMutation, useQueryClient } from 'react-query'

const useEditList = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (data: { listId: number; todoOrder: number[] }) =>
      editList(axiosPrivate, data),
    {
      onMutate: async (data) => {
        await queryClient.cancelQueries('listCollection')

        const previousListCollection =
          queryClient.getQueryData('listCollection')

        queryClient.setQueryData<IListCollection>(
          'listCollection',
          (prev: any) => ({
            ...prev,
            lists: prev.lists.map((list: IList) =>
              list.id === data.listId
                ? { ...list, todoOrder: data.todoOrder }
                : list,
            ),
          }),
        )

        return { previousListCollection }
      },
      onSuccess: () => queryClient.invalidateQueries('listCollection'),
      onError: () => {},
    },
  )

  return mutation
}

export default useEditList
