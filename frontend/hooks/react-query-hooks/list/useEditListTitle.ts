import { useMutation, useQueryClient } from 'react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { editList } from '@/lib/list.service'

const useEditListTitle = ({
  listId,
  title,
}: {
  listId: number
  title: string
}) => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () => editList(axiosPrivate, { listId, title }),
    {
      onSuccess: () => queryClient.invalidateQueries('listCollection'),
    },
  )
  return mutation
}

export default useEditListTitle
