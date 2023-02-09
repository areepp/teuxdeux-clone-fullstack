import axios from '@/lib/axios'
import useUserStore from '@/stores/user'

const useRefreshToken = () => {
  const { setUser } = useUserStore()

  const refresh = async () => {
    const response = await axios.get<{ accessToken: string }>('/auth/refresh', {
      withCredentials: true,
    })
    setUser(response.data.accessToken)
    return response.data.accessToken
  }

  return refresh
}

export default useRefreshToken
