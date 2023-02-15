import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { editTodo } from '@/lib/todo.service'
import useDateColumnStore from '@/stores/dateColumns'
import { ITodo } from '@/types/ITodo'
import { useMutation, useQueryClient } from 'react-query'

const useEditTodoText = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const dateColumnStore = useDateColumnStore()

  const mutation = useMutation(
    (data: { todoId: number; text: string }) => editTodo(axiosPrivate, data),
    {
      onMutate: async (data) => {
        await queryClient.cancelQueries([
          'todos',
          dateColumnStore.dateColumns.map((col) => col.id),
        ])

        const previousTodos = queryClient.getQueryData([
          'todos',
          dateColumnStore.dateColumns.map((col) => col.id),
        ])

        queryClient.setQueryData(
          ['todos', dateColumnStore.dateColumns.map((col) => col.id)],
          (prev: any) =>
            prev.map((todo: ITodo) =>
              todo.id === data.todoId ? { ...todo, text: data.text } : todo,
            ),
        )
        return { previousTodos }
      },
      onSettled: () =>
        queryClient.invalidateQueries([
          'todos',
          dateColumnStore.dateColumns.map((col) => col.id),
        ]),
      onError: (_err, _newTodo, context) => {
        queryClient.setQueryData(['todos'], context?.previousTodos)
      },
    },
  )

  return mutation
}

export default useEditTodoText
