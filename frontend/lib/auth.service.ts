import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { Inputs } from '@/components/Auth/Input'
import { clientAuth } from './firebaseClient'
import axios from './axios'

// export const signup = (data: Inputs) => {
//   const { email, password } = data
//   return createUserWithEmailAndPassword(clientAuth, email, password)
// }

// export const login = async (data: Inputs) => {
//   const { email, password } = data
//   return signInWithEmailAndPassword(clientAuth, email, password)
// }

export const signup = async (body: Inputs) => {
  try {
    const { data } = await axios.post('/auth/signup', JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
    return data
  } catch (err: any) {
    throw err.response.data
  }
}

export const login = async (body: Inputs) => {
  try {
    const { data } = await axios.post('/auth/signup', JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
    return data
  } catch (err: any) {
    throw err.response.data
  }
}

// prettier-ignore
export const logOut = async () => signOut(clientAuth)
