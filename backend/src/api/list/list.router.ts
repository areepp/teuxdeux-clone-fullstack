import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import * as listController from './list.controller'
import { EditListSchema } from './list.model'

const listRouter = express.Router()

listRouter.post('/', listController.createList)

listRouter.patch(
  '/:id',
  validateRequest({
    body: EditListSchema,
  }),
  listController.editList,
)

listRouter.delete('/:id', listController.deleteList)

export default listRouter
