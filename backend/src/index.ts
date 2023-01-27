import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { todoRouter } from './todo/todo.router'
import { listCollectionRouter } from './listCollection/listCollection.router'
import { listRouter } from './list/list.router'
import { dateColumnRouter } from './dateColumn/dateColumn.router'
import { authRouter } from './auth/auth.router'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/todos', todoRouter)
app.use('/api/lists', listRouter)
app.use('/api/list-collections', listCollectionRouter)
app.use('/api/date-columns', dateColumnRouter)
app.use('/api/auth', authRouter)

app.listen(5000, () => {
  console.log('server is running on port 5000')
})
