import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JWTPayload } from '../../types/jwt'
import ApiError from '../../utils/CustomException'
import * as listCollectionService from '../listCollection/listCollection.service'
import * as authService from './auth.service'

export const signup = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await authService.signup(req.body)

    // create new list collection for the newly created user
    await listCollectionService.createListCollection({
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

    await authService.editUser({
      id: user.id,
      refreshToken,
    })

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 7 * 1000, // 7 days
      secure: false,
      sameSite: 'strict',
      path: '/',
      domain: process.env.CLIENT_DOMAIN,
    })

    return res.json({ accessToken })
  } catch (error: any) {
    return next(error)
  }
}

export const logout = async (req: Request, res: Response) => {
  const { cookies } = req
  if (!cookies?.jwt) return res.json('logged out')

  const refreshToken = cookies.jwt
  const userFound = await authService.userWithRefreshTokenExists(refreshToken)

  if (!userFound) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    return res.json('logged out')
  }

  await authService.editUser({
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
    const { cookies } = req

    if (!cookies?.jwt) {
      res.status(401)
      throw new ApiError('unauthorized', 401)
    }

    const refreshToken = cookies.jwt
    const userFound = await authService.userWithRefreshTokenExists(refreshToken)

    if (!userFound) {
      res.status(403)
      throw new ApiError('Forbidden', 403)
    }

    const { userInfo } = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as JWTPayload

    if (userFound.id !== userInfo.id) {
      res.status(403)
      throw new ApiError('Forbidden', 403)
    }

    const accessToken = jwt.sign(
      { userInfo: { id: userFound.id, email: userFound.email } },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' },
    )

    return res.json({ accessToken })
  } catch (error) {
    return next(error)
  }
}
