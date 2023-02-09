import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { EditTodoOrderSchema, GetDateColumnsSchema } from './dateColumn.model'
import * as dateColumnController from './dateColumn.controller'

export const dateColumnRouter = express.Router()

dateColumnRouter.get(
  '/',
  validateRequest({ query: GetDateColumnsSchema }), // this will in the form of date;date;date;date (dateformat: month-day-year)
  dateColumnController.getDateColumns,
)

dateColumnRouter.patch(
  '/:id',
  validateRequest({ body: EditTodoOrderSchema }),
  dateColumnController.editTodoOrder,
)
