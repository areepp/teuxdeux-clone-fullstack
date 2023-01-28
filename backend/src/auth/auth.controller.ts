import { NextFunction, Request, Response } from 'express'
import * as authService from './auth.service'
import jwt from 'jsonwebtoken'

export const signup = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
) => {
  try {
    const createUser = await authService.signup(req.body)

    return res.status(201).json({
      message: 'User succesfully created',
    })
  } catch (error) {
    return res.json(error)
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
      { email: user.email, id: user.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '15m' },
    )

    const refreshToken = jwt.sign(
      { email: user.email, id: user.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: '1y' },
    )

    const storeRefreshToken = await authService.storeRefreshToken({
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
