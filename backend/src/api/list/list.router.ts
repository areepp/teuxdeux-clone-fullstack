import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import * as listController from './list.controller'
import { EditListSchema, PostListSchema } from './list.model'

export const listRouter = express.Router()

listRouter.post('/', listController.createList)

listRouter.patch(
  '/:id',
  validateRequest({
    body: EditListSchema,
  }),
  listController.editList,
)

listRouter.delete('/:id', listController.deleteList)
