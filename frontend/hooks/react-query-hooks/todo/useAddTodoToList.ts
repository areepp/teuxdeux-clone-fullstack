import { useMutation, useQueryClient } from 'react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { addTodo } from '@/lib/todo.service'

const useAddTodoToListMutation = ({
  text,
  listId,
}: {
  text: string
  listId: number
}) => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () =>
      addTodo(axiosPrivate, {
        text,
        listId,
      }),
    { onSuccess: () => queryClient.invalidateQueries('listCollection') },
  )
  return mutation
}

export default useAddTodoToListMutation
