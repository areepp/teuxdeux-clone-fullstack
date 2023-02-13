import { useMutation, useQueryClient } from 'react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { createList } from '@/lib/list.service'

const useCreateList = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation(() => createList(axiosPrivate), {
    onSuccess: () => queryClient.invalidateQueries('listCollection'),
  })

  return mutation
}

export default useCreateList
