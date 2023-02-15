import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { deleteTodo } from '@/lib/todo.service'
import useDateColumnStore from '@/stores/dateColumns'
import { IList } from '@/types/IList'
import { ITodo } from '@/types/ITodo'
import { useMutation, useQueryClient } from 'react-query'

const useDeleteTodoFromList = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const dateColumnStore = useDateColumnStore()

  const mutation = useMutation(
    (data: { todoId: number; listId: number }) =>
      deleteTodo(axiosPrivate, data),
    {
      onMutate: async (data) => {
        await Promise.all([
          queryClient.cancelQueries('listCollection'),
          queryClient.cancelQueries([
            'todos',
            dateColumnStore.dateColumns.map((col) => col.id),
          ]),
        ])

        const previousTodos = queryClient.getQueryData([
          'todos',
          dateColumnStore.dateColumns.map((col) => col.id),
        ])

        const previousListCollection =
          queryClient.getQueryData('listCollection')

        queryClient.setQueryData(
          ['todos', dateColumnStore.dateColumns.map((col) => col.id)],
          (prev: any) => prev.filter((todo: ITodo) => todo.id !== data.todoId),
        )

        queryClient.setQueryData('listCollection', (prev: any) => ({
          ...prev,
          lists: prev.lists.map((list: IList) =>
            // prettier-ignore
            list.id === data.listId
              ? {
                ...list,
                todoOrder: list.todoOrder.filter((id) => id !== data.todoId),
              }
              : list,
          ),
        }))

        return { previousTodos, previousListCollection }
      },
      onSettled: () =>
        Promise.all([
          queryClient.invalidateQueries('listCollection'),
          queryClient.invalidateQueries([
            'todos',
            dateColumnStore.dateColumns.map((col) => col.id),
          ]),
        ]),
      onError: (_err, _data, context) => {
        queryClient.setQueryData(
          'listCollection',
          context?.previousListCollection,
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

export default useDeleteTodoFromList
