import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import * as todoController from './todo.controller'
import {
  AddTodoSchema,
  DeleteTodoSchema,
  EditTodoSchema,
  GetTodoSchema,
} from './todo.model'

const todoRouter = express.Router()

todoRouter.get(
  '/',
  validateRequest({ query: GetTodoSchema }),
  todoController.getTodos,
)

todoRouter.post(
  '/',
  validateRequest({ body: AddTodoSchema }),
  todoController.addTodo,
)

todoRouter.patch(
  '/:id',
  validateRequest({
    body: EditTodoSchema,
  }),
  todoController.editTodo,
)

todoRouter.delete(
  '/:id',
  validateRequest({
    body: DeleteTodoSchema,
  }),
  todoController.deleteTodo,
)

export default todoRouter
