import express from 'express'
import validateRequest from '../middlewares/validateRequest'
import DateColumn, {
  EditTodoOrderSchema,
  GetDateColumnsSchema,
} from './dateColumn.model'
import * as dateColumnController from './dateColumn.controller'
import { verifyJWT } from '../middlewares/verifyJWT'

export const dateColumnRouter = express.Router()

dateColumnRouter.get(
  '/',
  validateRequest({ body: GetDateColumnsSchema }),
  dateColumnController.getDateColumns,
)

dateColumnRouter.patch(
  '/:id',
  validateRequest({ body: EditTodoOrderSchema }),
  dateColumnController.editTodoOrder,
)
