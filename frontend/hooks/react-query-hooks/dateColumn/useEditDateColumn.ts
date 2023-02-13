import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { editTodoOrder } from '@/lib/dateColumn.service'
import { useMutation } from 'react-query'

const useEditDateColumn = () => {
  const axiosPrivate = useAxiosPrivate()

  const mutation = useMutation((data: { id: string; todoOrder: number[] }) =>
    editTodoOrder(axiosPrivate, data),
  )

  return mutation
}

export default useEditDateColumn
