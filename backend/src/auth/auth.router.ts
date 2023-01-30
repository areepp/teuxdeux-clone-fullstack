import express from 'express'
import * as authController from './auth.controller'
import validateRequest from '../middlewares/validateRequest'
import { AuthSchema } from './auth.model'

export const authRouter = express.Router()

authRouter.post(
  '/signup',
  validateRequest({ body: AuthSchema }),
  authController.signup,
)

authRouter.post(
  '/login',
  validateRequest({ body: AuthSchema }),
  authController.login,
)

authRouter.get('/logout', authController.logout)

authRouter.get('/refresh', authController.handleRefreshToken)
