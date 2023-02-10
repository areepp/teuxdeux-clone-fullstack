import { NextFunction, Request, Response } from 'express'
import ApiError from '../utils/CustomException'

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    const statusCode = err.statusCode ?? 500
    res.status(statusCode)
    return res.json({
      message: err.message,
    })
  }

  return res.status(500).json('something went wrong')
}

export default errorHandler
