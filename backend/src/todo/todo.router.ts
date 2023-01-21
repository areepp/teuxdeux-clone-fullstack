import express from 'express'
import { Request, Response } from 'express'
import * as todoController from './todo.controller'

export const todoRouter = express.Router()

todoRouter.get('/', todoController.getTodos)
