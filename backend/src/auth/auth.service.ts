import { db } from '.././utils/db'
import { AuthSchema } from './auth.model'
import bcrypt from 'bcryptjs'
import { ResponseError } from '../types/Error'

export const signup = async ({ email, password }: AuthSchema) => {
  const userExists = await db.user.count({ where: { email } })

  if (userExists) {
    const error: ResponseError = new Error()
    error.message = 'User with that email address already exists'
    error.status = 422
    throw error
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = await db.user.create({
    data: {
      email,
      password: passwordHash,
    },
  })

  return newUser
}

export const login = async ({ email, password }: AuthSchema) => {
  const user = await db.user.findUnique({ where: { email } })

  if (!user) {
    throw new Error('Incorrect email or password')
  }

  const passwordMatches = await bcrypt.compare(password, user.password)

  if (!passwordMatches) {
    throw new Error('Incorrect email or password')
  }

  return user
}

export const userWithRefreshTokenExists = async (refreshToken: string) =>
  db.user.findUnique({
    where: {
      refreshToken,
    },
  })

export const editUser = async ({
  id,
  refreshToken,
}: {
  id: string
  refreshToken: string
}) =>
  db.user.update({
    where: {
      id,
    },
    data: {
      refreshToken,
    },
  })
