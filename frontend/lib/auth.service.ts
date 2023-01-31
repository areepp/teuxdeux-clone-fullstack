import { Inputs } from '@/components/Auth/Input'
import { GetServerSidePropsContext } from 'next'
import axios from './axios'

export const signup = async (body: Inputs) => {
  try {
    await axios.post('/auth/signup', JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
  } catch (err: any) {
    throw err.response.data
  }
}

export const login = async (body: Inputs) => {
  try {
    const { data } = await axios.post<{ accessToken: string }>(
      '/auth/login',
      JSON.stringify(body),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      },
    )
    return data.accessToken
  } catch (err: any) {
    throw err.response.data
  }
}

export const getRefreshTokenSSR = async (
  context: GetServerSidePropsContext,
) => {
  try {
    const { data } = await axios.get<{ accessToken: string }>('/auth/refresh', {
      withCredentials: true,
      headers: {
        cookie: context.req.headers.cookie,
      },
    })
    return data.accessToken
  } catch (err: any) {
    throw err.response.data
  }
}

// prettier-ignore
export const logOut = async () =>  {
  try {
  await axios.post('/auth/logout', {}, { withCredentials: true })
  } catch (err: any) {
    throw err.response.data
  }
}
