/* eslint-disable no-unused-vars */
import User from '../../api/auth/auth.model'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}
