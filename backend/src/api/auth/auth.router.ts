import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import * as authController from './auth.controller'
import { AuthSchema } from './auth.model'

const authRouter = express.Router()

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

authRouter.post('/logout', authController.logout)

authRouter.get('/refresh', authController.handleRefreshToken)

export default authRouter
