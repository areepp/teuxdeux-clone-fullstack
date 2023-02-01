import { NextFunction, Request, Response } from 'express'
import * as authService from './auth.service'
import * as listCollectionService from '../listCollection/listCollection.service'
import jwt from 'jsonwebtoken'
import { JWTPayload } from '../types/jwt'

export const signup = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.signup(req.body)

    // create new list collection for the newly created user
    const newListCollection = await listCollectionService.createListCollection({
      id: user.id,
    })

    return res.status(201).json({
      message: 'User succesfully created',
    })
  } catch (error) {
    return next(error)
  }
}

export const login = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.login(req.body)

    const accessToken = jwt.sign(
      { userInfo: { id: user.id, email: user.email } },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' },
    )

    const refreshToken = jwt.sign(
      { userInfo: { id: user.id, email: user.email } },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '1y' },
    )

    const storeRefreshToken = await authService.editUser({
      id: user.id,
      refreshToken,
    })

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 7 * 1000, // 7 days
    })

    return res.json({ accessToken })
  } catch (error) {
    next(error)
  }
}

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.json('logged out')

  const refreshToken = cookies.jwt
  const userFound = await authService.userWithRefreshTokenExists(refreshToken)

  if (!userFound) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    return res.json('logged out')
  }

  const removeRefreshToken = await authService.editUser({
    id: userFound.id,
    refreshToken: '',
  })

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
  return res.json('logged out')
}

export const handleRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cookies = req.cookies

    if (!cookies?.jwt) {
      res.status(401)
      throw new Error('unauthorized')
    }

    const refreshToken = cookies.jwt
    const userFound = await authService.userWithRefreshTokenExists(refreshToken)

    if (!userFound) {
      res.status(403)
      throw new Error('Forbidden')
    }

    const { userInfo } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as JWTPayload

    if (userFound.id !== userInfo.id) {
      res.status(403)
      throw new Error('Forbidden')
    }

    const accessToken = jwt.sign(
      { userInfo: { id: userFound.id, email: userFound.email } },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' },
    )

    return res.json({ accessToken })
  } catch (err) {
    next(err)
  }
}
