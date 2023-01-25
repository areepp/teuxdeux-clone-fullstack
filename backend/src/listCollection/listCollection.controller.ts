import { Request, Response } from 'express'
import ListCollection from './listCollection.model'
import * as listCollectionService from './listCollection.service'

export const getListCollection = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const lists = await listCollectionService.getListCollection({
      id: parseInt(req.params.id),
    })
    return res.status(200).json(lists)
  } catch (error: any) {
    return res.json(error)
  }
}

export const editListOrder = async (
  req: Request<{ id: string }, {}, Pick<ListCollection, 'listOrder'>>,
  res: Response,
) => {
  try {
    const list = await listCollectionService.editListOrder({
      id: parseInt(req.params.id),
      listOrder: req.body.listOrder,
    })
    return res.status(200).json(list)
  } catch (error) {
    return res.json(error)
  }
}
