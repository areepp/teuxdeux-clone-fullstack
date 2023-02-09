import { useQuery, UseQueryOptions } from 'react-query'
import * as dateColumnService from '@/lib/dateColumn.service'
import useAxiosPrivate from './useAxiosPrivate'
import { useEffect, useState } from 'react'
import useDateColumnStore from '@/stores/dateColumns'

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
    options,
  )

  useEffect(() => {
    if (query.isSuccess) {
      dateColumnStore.syncColumns(query.data)
    }
  }, [query.isSuccess, query.isFetching])

  return query
}

export default useDateColumnQuery
