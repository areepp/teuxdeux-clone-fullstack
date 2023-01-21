import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { todoRouter } from './todo/todo.router'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/todos', todoRouter)

app.listen(5000, () => {
  console.log('server is running on port 5000')
})
