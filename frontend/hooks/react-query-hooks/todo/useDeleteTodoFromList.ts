import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { deleteTodo } from '@/lib/todo.service'
import { useMutation, useQueryClient } from 'react-query'

const useDeleteTodoFromList = ({
  todoId,
  listId,
}: {
  todoId: number
  listId: number
}) => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () =>
      deleteTodo(axiosPrivate, {
        todoId,
        listId,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries('listCollection'),
    },
  )

  return mutation
}

export default useDeleteTodoFromList
