import { Request, Response } from 'express'
import { DeleteListSchema, EditListSchema, PostListSchema } from './list.model'
import * as listService from './list.service'

export const createList = async (
  req: Request<{}, {}, PostListSchema>,
  res: Response,
) => {
  try {
    const list = await listService.createList({
      listCollectionId: req.body.listCollectionId,
    })
    return res.status(200).json(list)
  } catch (error) {
    return res.json(error)
  }
}

export const editList = async (
  req: Request<{ id: string }, {}, EditListSchema>,
  res: Response,
) => {
  try {
    const list = await listService.editList({
      id: parseInt(req.params.id),
      ...req.body,
    })
    return res.status(200).json(list)
  } catch (error) {
    return res.json(error)
  }
}

export const deleteList = async (
  req: Request<{ id: string }, {}, DeleteListSchema>,
  res: Response,
) => {
  try {
    const list = await listService.deleteList({
      listId: parseInt(req.params.id),
      listCollectionId: req.body.listCollectionId,
    })
    return res.status(200).json(list)
  } catch (error) {
    return res.json(error)
  }
}
