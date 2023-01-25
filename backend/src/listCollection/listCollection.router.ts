import express from 'express'
import validateRequest from '../middleware/validateRequest'
import * as listCollectionController from './listCollection.controller'
import ListCollection from './listCollection.model'

export const listCollectionRouter = express.Router()

listCollectionRouter.get('/:id', listCollectionController.getListCollection)

listCollectionRouter.patch(
  '/:id',
  validateRequest({ body: ListCollection.pick({ listOrder: true }) }),
  listCollectionController.editListOrder,
)
