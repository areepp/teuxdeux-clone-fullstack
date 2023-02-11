import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import todoRouter from './api/todo/todo.router'
import listCollectionRouter from './api/listCollection/listCollection.router'
import listRouter from './api/list/list.router'
import dateColumnRouter from './api/dateColumn/dateColumn.router'
import authRouter from './api/auth/auth.router'
import errorHandler from './middlewares/errorHandler'
import verifyJWT from './middlewares/verifyJWT'
// import credentials from './middlewares/credentials'
import corsOptions from './utils/corsOptions'

dotenv.config()

const app = express()

app.use((req, res, next) => {
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
}) // new

// app.use(credentials)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.get('/', (_req, res) => res.send('Hello world!'))

app.use('/api/auth', authRouter)

// AUTHENTICATION REQUIRED
app.use(verifyJWT)
app.use('/api/todos', todoRouter)
app.use('/api/lists', listRouter)
app.use('/api/list-collections', listCollectionRouter)
app.use('/api/date-columns', dateColumnRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server is running on port ${PORT}`)
})
