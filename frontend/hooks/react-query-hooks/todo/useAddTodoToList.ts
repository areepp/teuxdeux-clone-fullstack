import { useMutation, useQueryClient } from 'react-query'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { addTodo } from '@/lib/todo.service'
import useDateColumnStore from '@/stores/dateColumns'
import { IList } from '@/types/IList'

const useAddTodoToListMutation = () => {
  const axiosPrivate = useAxiosPrivate()
  const queryClient = useQueryClient()
  const dateColumnStore = useDateColumnStore()

  const mutation = useMutation(
    (data: { text: string; listId: number }) => addTodo(axiosPrivate, data),
    {
      onMutate: async (data) => {
        await Promise.all([
          queryClient.cancelQueries('listCollection'),
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

        const previousListCollection =
          queryClient.getQueryData('listCollection')

        queryClient.setQueryData(
          ['todos', dateColumnStore.dateColumns.map((col) => col.id)],
          (prev: any) => [
            ...prev,
            {
              id: tempId,
              text: data.text,
              checked: false,
              listId: data.listId,
            },
          ],
        )

        queryClient.setQueryData('listCollection', (prev: any) => ({
          ...prev,
          lists: prev.lists.map((list: IList) =>
            list.id === data.listId
              ? { ...list, todoOrder: [...list.todoOrder, tempId] }
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

export default useAddTodoToListMutation
