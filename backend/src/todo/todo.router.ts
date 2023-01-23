import express from 'express'
import { Request, Response } from 'express'
import validateRequest from '../middleware/validateRequest'
import * as todoController from './todo.controller'
import Todo, { ArrayOfIdsInput, EditTodoInput } from './todo.model'

export const todoRouter = express.Router()

todoRouter.get('/', todoController.getTodos)

todoRouter.get(
  '/by-ids',
  validateRequest({ body: ArrayOfIdsInput }),
  todoController.getTodosByIds,
)

todoRouter.post(
  '/',
  validateRequest({ body: Todo.pick({ text: true }) }),
  todoController.addTodo,
)

todoRouter.patch(
  '/:id',
  validateRequest({
    body: EditTodoInput,
  }),
  todoController.editTodo,
)

todoRouter.delete('/:id', todoController.deleteTodo)
