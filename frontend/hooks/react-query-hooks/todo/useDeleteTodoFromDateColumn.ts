import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { deleteTodo } from '@/lib/todo.service'
import { useMutation, useQueryClient } from 'react-query'

const useDeleteTodoFromDateColumn = ({
  todoId,
  dateColumnId,
}: {
  todoId: number
  dateColumnId: string
}) => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () =>
      deleteTodo(axiosPrivate, {
        todoId,
        dateColumnId,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries('dateColumn'),
    },
  )

  return mutation
}

export default useDeleteTodoFromDateColumn
