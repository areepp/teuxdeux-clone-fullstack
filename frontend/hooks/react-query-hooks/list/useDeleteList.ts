import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { deleteList } from '@/lib/list.service'
import { useMutation, useQueryClient } from 'react-query'

const useDeleteList = ({ listId }: { listId: number }) => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation(() => deleteList(axiosPrivate, { listId }), {
    onSuccess: () => queryClient.invalidateQueries('listCollection'),
  })

  return mutation
}

export default useDeleteList
