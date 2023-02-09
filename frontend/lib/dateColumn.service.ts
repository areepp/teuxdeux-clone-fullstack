import { AxiosInstance } from 'axios'

export const getDateColumnsByIds = async (
  axiosPrivate: AxiosInstance,
  { ids }: { ids: string[] },
) => {
  try {
    const response = await axiosPrivate.get('/date-columns', {
      params: {
        ids: ids.join(';'),
      },
    })
    return response.data
  } catch (error: any) {
    return error.response.data
  }
}

export const editTodoOrder = async (
  axiosPrivate: AxiosInstance,
  { id, todoOrder }: { id: string; todoOrder: number[] },
) => axiosPrivate.patch(`/date-columns/${id}`, { todoOrder })
