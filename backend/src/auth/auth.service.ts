import { db } from '.././utils/db'
import { SignUpUserSchema } from './auth.model'
import bcrypt from 'bcryptjs'
import { ResponseError } from '../types/Error'

export const signup = async ({ email, password }: SignUpUserSchema) => {
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
