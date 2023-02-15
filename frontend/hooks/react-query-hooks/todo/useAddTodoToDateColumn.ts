import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { addTodo } from '@/lib/todo.service'
import useDateColumnStore from '@/stores/dateColumns'
import { IDateColumn } from '@/types/IDateColumn'
import { useMutation, useQueryClient } from 'react-query'

const useAddTodoToDateColumn = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const dateColumnStore = useDateColumnStore()

  const mutation = useMutation(
    (data: { text: string; dateColumnId: string }) =>
      addTodo(axiosPrivate, data),
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

        const tempId = Math.random()

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
          (prev: any) => [
            ...prev,
            {
              id: tempId,
              text: data.text,
              checked: false,
              dateColumnId: data.dateColumnId,
            },
          ],
        )

        queryClient.setQueryData(
          ['dateColumn', dateColumnStore.dateColumns.map((col) => col.id)],
          (prev: any) =>
            prev.map((col: IDateColumn) =>
              col.id === data.dateColumnId
                ? { ...col, todoOrder: [...col.todoOrder, tempId] }
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

export default useAddTodoToDateColumn
