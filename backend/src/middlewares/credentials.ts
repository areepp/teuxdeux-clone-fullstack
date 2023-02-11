import { NextFunction, Request, Response } from 'express'

const credentials = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Origin',
    process.env.NODE_ENV === 'development'
      ? 'localhost'
      : 'teuxdeux-clone.up.railway.app',
  )
  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
  )
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
  )
  next()
}

export default credentials
