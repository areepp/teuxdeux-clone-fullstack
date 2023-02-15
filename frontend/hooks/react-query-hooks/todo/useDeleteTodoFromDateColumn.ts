import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { deleteTodo } from '@/lib/todo.service'
import useDateColumnStore from '@/stores/dateColumns'
import { IDateColumn } from '@/types/IDateColumn'
import { ITodo } from '@/types/ITodo'
import { useMutation, useQueryClient } from 'react-query'

const useDeleteTodoFromDateColumn = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const dateColumnStore = useDateColumnStore()

  const mutation = useMutation(
    (data: { todoId: number; dateColumnId: string }) =>
      deleteTodo(axiosPrivate, data),
    {
      onMutate: async (data) => {
        await Promise.all([
          queryClient.cancelQueries([
            'dateColumn',
            dateColumnStore.dateColumns.map((col) => col.id),
          ]),
          queryClient.cancelQueries([
            'todos',
            dateColumnStore.dateColumns.map((col) => col.id),
          ]),
        ])

        const previousTodos = queryClient.getQueryData([
          'todos',
          dateColumnStore.dateColumns.map((col) => col.id),
        ])

        const previousDateColumn = queryClient.getQueryData([
          'dateColumn',
          dateColumnStore.dateColumns.map((col) => col.id),
        ])

        queryClient.setQueryData(
          ['todos', dateColumnStore.dateColumns.map((col) => col.id)],
          (prev: any) => prev.filter((todo: ITodo) => todo.id !== data.todoId),
        )

        queryClient.setQueryData(
          ['dateColumn', dateColumnStore.dateColumns.map((col) => col.id)],
          (prev: any) =>
            // prettier-ignore
            prev.map((col: IDateColumn) =>
              col.id === data.dateColumnId
                ? {
                  ...col,
                  todoOrder: col.todoOrder.filter(
                    (el) => el !== data.todoId,
                  ),
                }
                : col,
            ),
        )

        return { previousTodos, previousDateColumn }
      },
      onSettled: () =>
        Promise.all([
          queryClient.invalidateQueries([
            'dateColumn',
            dateColumnStore.dateColumns.map((col) => col.id),
          ]),
          queryClient.invalidateQueries([
            'todos',
            dateColumnStore.dateColumns.map((col) => col.id),
          ]),
        ]),
      onError: (_err, _data, context) => {
        queryClient.setQueryData(
          ['dateColumn', dateColumnStore.dateColumns.map((col) => col.id)],
          context?.previousDateColumn,
        )
        queryClient.setQueryData(
          ['todos', dateColumnStore.dateColumns.map((col) => col.id)],
          context?.previousTodos,
        )
      },
    },
  )

  return mutation
}

export default useDeleteTodoFromDateColumn
