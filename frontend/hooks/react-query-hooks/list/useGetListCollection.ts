import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { getListCollection } from '@/lib/listCollection.service'
import { useQuery } from 'react-query'

const useGetListCollection = () => {
  const axiosPrivate = useAxiosPrivate()
  const query = useQuery('listCollection', () =>
    getListCollection(axiosPrivate).then((resData) => resData),
  )

  return query
}

export default useGetListCollection
