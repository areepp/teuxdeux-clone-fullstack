import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { todoRouter } from './todo/todo.router'
import { listCollectionRouter } from './listCollection/listCollection.router'
import { listRouter } from './list/list.router'
import { dateColumnRouter } from './dateColumn/dateColumn.router'
import { authRouter } from './auth/auth.router'
import { errorHandler } from './middlewares/errorHandler'
import User from './auth/auth.model'
import { verifyJWT } from './middlewares/verifyJWT'

declare global {
  namespace Express {
    interface Request {
      context: User
    }
  }
}

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)

// AUTHENTICATION NEEDED
app.use(verifyJWT)
app.use('/api/todos', todoRouter)
app.use('/api/lists', listRouter)
app.use('/api/list-collections', listCollectionRouter)
app.use('/api/date-columns', dateColumnRouter)

app.use(errorHandler)

app.listen(5000, () => {
  console.log('server is running on port 5000')
})
