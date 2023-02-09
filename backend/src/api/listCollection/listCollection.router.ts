import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import * as listCollectionController from './listCollection.controller'
import ListCollection from './listCollection.model'

export const listCollectionRouter = express.Router()

listCollectionRouter.get('/', listCollectionController.getListCollection)

listCollectionRouter.patch(
  '/',
  validateRequest({ body: ListCollection.pick({ listOrder: true }) }),
  listCollectionController.editListOrder,
)
