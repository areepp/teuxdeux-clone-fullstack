import express from 'express'

import User from '../../api/auth/auth.model'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}
