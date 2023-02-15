import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { getTodos } from '@/lib/todo.service'
import { ITodo } from '@/types/ITodo'
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query'

const useGetTodos = (
  ids: string[],
  options?:
    | Omit<UseQueryOptions<any, unknown, any, any>, 'queryKey' | 'queryFn'>
    | undefined,
) => {
  const axiosPrivate = useAxiosPrivate()
  const query: UseQueryResult<ITodo[] | undefined> = useQuery(
    ['todos', ids],
    () => getTodos(axiosPrivate, { ids }),
    {
      ...options,
    },
  )

  return query
}

export default useGetTodos
