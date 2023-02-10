import { GetServerSidePropsContext } from 'next'
import { Inputs } from '@/components/Auth/Input'
import axios from './axios'

export const signup = async (body: Inputs) =>
  axios.post('/auth/signup', JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  })

export const login = async (body: Inputs) =>
  axios.post<{ accessToken: string }>('/auth/login', JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  })

export const getRefreshTokenSSR = async (context: GetServerSidePropsContext) =>
  axios.get<{ accessToken: string }>('/auth/refresh', {
    withCredentials: true,
    headers: {
      cookie: context.req.headers.cookie,
    },
  })

// prettier-ignore
export const logOut = async () => axios.post('/auth/logout', {}, { withCredentials: true })
