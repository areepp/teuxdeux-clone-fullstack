import { Request, Response } from 'express'

const errorHandler = (err: Error, req: Request, res: Response) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
  })
}

export default errorHandler
