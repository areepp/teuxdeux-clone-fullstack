import express from 'express'
import * as authController from './auth.controller'
import validateRequest from '../middlewares/validateRequest'
import { SignUpUserSchema } from './auth.model'

export const authRouter = express.Router()

authRouter.post(
  '/signup',
  validateRequest({ body: SignUpUserSchema }),
  authController.signup,
)
