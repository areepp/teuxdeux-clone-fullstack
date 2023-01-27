import { Request, Response } from 'express'
import * as authService from './auth.service'

export const signup = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
) => {
  try {
    const createUser = await authService.signup(req.body)

    res.status(201).json({
      message: 'User succesfully created',
    })
  } catch (error) {
    return res.json(error)
  }
}
