import { useQuery, UseQueryOptions } from 'react-query'
import * as dateColumnService from '@/lib/dateColumn.service'
import useDateColumnStore from '@/stores/dateColumns'
import useAxiosPrivate from '../useAxiosPrivate'

const useDateColumnQuery = (
  ids: string[],
  options?:
    | Omit<UseQueryOptions<any, unknown, any, any>, 'queryKey' | 'queryFn'>
    | undefined,
) => {
  const dateColumnStore = useDateColumnStore()
  const axiosPrivate = useAxiosPrivate()

  const query = useQuery(
    ['dateColumn', ids],
    () =>
      dateColumnService.getDateColumnsByIds(axiosPrivate, {
        ids,
      }),
    {
      onSuccess: (data) => {
        dateColumnStore.syncColumns(data)
      },
      ...options,
    },
  )

  return query
}

export default useDateColumnQuery
