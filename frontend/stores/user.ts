/* eslint-disable no-unused-vars */
import create from 'zustand'
import jwtDecode from 'jwt-decode'

export interface User {
  email: string
  id: string
  accessToken: string
}

export interface UserStore {
  user: User | null
  setUser: (accessToken: string) => void
  resetUser: () => void
}

const useUserStore = create<UserStore>((set: any) => ({
  user: null,
  setUser: (accessToken: string) =>
    set(() => {
      const { userInfo } = jwtDecode<{ userInfo: Omit<User, 'id'> }>(
        accessToken,
      )
      return {
        user: { ...userInfo, accessToken },
      }
    }),
  resetUser: () =>
    set(() => ({
      user: null,
    })),
}))

export default useUserStore
