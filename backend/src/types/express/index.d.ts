import express from 'express'

import User from '../../auth/auth.model'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}
