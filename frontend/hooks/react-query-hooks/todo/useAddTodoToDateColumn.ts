import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { addTodo } from '@/lib/todo.service'
import { useMutation, useQueryClient } from 'react-query'

const useAddTodoToDateColumn = ({
  text,
  dateColumnId,
}: {
  text: string
  dateColumnId: string
}) => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () =>
      addTodo(axiosPrivate, {
        text,
        dateColumnId,
      }),
    { onSuccess: () => queryClient.invalidateQueries('dateColumn') },
  )

  return mutation
}

export default useAddTodoToDateColumn
