import { createContext, useContext, useState } from 'react'

interface User {
  id: string
  email: string
}

interface ContextValue {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

const MyAuthContext = createContext<ContextValue>({
  user: null,
  setUser: () => {},
})

export const MyAuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null)

  return (
    <MyAuthContext.Provider value={{ user, setUser }}>
      {children}
    </MyAuthContext.Provider>
  )
}

export const useMyAuth = () => useContext(MyAuthContext)
