import { NextFunction, Request, Response } from 'express'
import { ALLOWED_ORIGINS } from '../utils/allowedOrigins'

export const credentials = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const origin = req.headers.origin ? req.headers.origin : ''
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', 'true')
  }
  next()
}
