import { NextFunction, Request, Response } from 'express'
import ListCollection from './listCollection.model'
import * as listCollectionService from './listCollection.service'

export const getListCollection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const lists = await listCollectionService.getListCollection({
      userId: req.user!.id,
    })
    return res.status(200).json(lists)
  } catch (error: any) {
    next(error)
  }
}

export const editListOrder = async (
  req: Request<{}, {}, Pick<ListCollection, 'listOrder'>>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const list = await listCollectionService.editListOrder({
      userId: req.user!.id,
      listOrder: req.body.listOrder,
    })
    return res.status(200).json(list)
  } catch (error) {
    next(error)
  }
}
