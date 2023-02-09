import { Request, Response } from 'express'
import { EditListSchema, PostListSchema } from './list.model'
import * as listService from './list.service'

export const createList = async (
  req: Request<{}, {}, PostListSchema>,
  res: Response,
) => {
  try {
    const list = await listService.createList({
      userId: req.user!.id,
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
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const list = await listService.deleteList({
      listId: parseInt(req.params.id),
      userId: req.user!.id,
    })
    return res.status(200).json(list)
  } catch (error) {
    return res.json(error)
  }
}
