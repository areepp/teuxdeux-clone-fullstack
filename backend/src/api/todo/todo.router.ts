import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import * as todoController from './todo.controller'
import Todo, {
  AddTodoSchema,
  DeleteTodoSchema,
  EditTodoSchema,
} from './todo.model'

export const todoRouter = express.Router()

todoRouter.get('/', todoController.getTodos)

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
