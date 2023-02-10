import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../api/auth/auth.model'
import { JWTPayload } from '../types/jwt'
import ApiError from '../utils/CustomException'

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    throw new ApiError('user unauthorized', 401)
  }
  const token = authHeader.split(' ')[1]
  try {
    const user = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as JWTPayload
    req.user = user.userInfo as User
    next()
  } catch (err) {
    res.status(403)
    throw new ApiError('user unauthorized', 403)
  }
}

export default verifyJWT
