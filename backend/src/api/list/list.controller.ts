import { NextFunction, Request, Response } from 'express'
import { EditListSchema, PostListSchema } from './list.model'
import * as listService from './list.service'

export const createList = async (
  req: Request<{}, {}, PostListSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const list = await listService.createList({
      userId: req.user!.id,
    })
    return res.status(200).json(list)
  } catch (error) {
    return next(error)
  }
}

export const editList = async (
  req: Request<{ id: string }, {}, EditListSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const list = await listService.editList({
      id: parseInt(req.params.id, 10),
      ...req.body,
    })
    return res.status(200).json(list)
  } catch (error) {
    return next(error)
  }
}

export const deleteList = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const list = await listService.deleteList({
      listId: parseInt(req.params.id, 10),
      userId: req.user!.id,
    })
    return res.status(200).json(list)
  } catch (error) {
    return next(error)
  }
}
