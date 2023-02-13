import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { editTodo } from '@/lib/todo.service'
import { useMutation, useQueryClient } from 'react-query'

const useEditTodoText = ({
  parent,
  todoId,
  text,
}: {
  parent: 'dateColumn' | 'listCollection'
  todoId: number
  text: string
}) => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () =>
      editTodo(axiosPrivate, {
        todoId,
        text,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(parent),
    },
  )

  return mutation
}

export default useEditTodoText
