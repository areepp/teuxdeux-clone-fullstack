import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { editTodo } from '@/lib/todo.service'
import { useMutation, useQueryClient } from 'react-query'

const useToggleCheckTodo = ({
  parent,
  todoId,
  checked,
}: {
  parent: 'listCollection' | 'dateColumn'
  todoId: number
  checked: boolean
}) => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () =>
      editTodo(axiosPrivate, {
        todoId,
        checked,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(parent),
    },
  )

  return mutation
}

export default useToggleCheckTodo
