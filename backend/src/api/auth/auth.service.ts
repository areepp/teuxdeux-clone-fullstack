import bcrypt from 'bcryptjs'
import ApiError from '../../utils/CustomException'
import db from '../../utils/db'
import { AuthSchema } from './auth.model'

export const signup = async ({ email, password }: AuthSchema) => {
  const userExists = await db.user.count({ where: { email } })

  if (userExists) {
    throw new ApiError('User with the email address already exists.', 403)
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
    throw new ApiError('Incorrect email or password.', 401)
  }

  const passwordMatches = await bcrypt.compare(password, user.password)

  if (!passwordMatches) {
    throw new ApiError('Incorrect email or password.', 401)
  }

  return user
}

export const userWithRefreshTokenExists = async (refreshToken: string) =>
  db.user.findFirst({
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
