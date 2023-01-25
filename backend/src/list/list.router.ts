import express from 'express'
import validateRequest from '../middleware/validateRequest'
import * as listController from './list.controller'
import { DeleteListSchema, EditListSchema, PostListSchema } from './list.model'

export const listRouter = express.Router()

listRouter.post(
  '/',
  validateRequest({ body: PostListSchema }),
  listController.createList,
)

listRouter.patch(
  '/:id',
  validateRequest({
    body: EditListSchema,
  }),
  listController.editList,
)

listRouter.delete(
  '/:id',
  validateRequest({
    body: DeleteListSchema,
  }),
  listController.deleteList,
)
