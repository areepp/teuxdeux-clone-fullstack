import create from 'zustand'

interface User {
  email: string
  id: string
  accessToken: string
}

export interface UserStore {
  user: User | null
  setUser: (user: User) => void
  resetUser: () => void
}

const useUserStore = create<UserStore>((set: any) => ({
  user: null,
  setUser: (user: User) =>
    set(() => ({
      user,
    })),
  resetUser: () =>
    set(() => ({
      user: null,
    })),
}))

export default useUserStore
