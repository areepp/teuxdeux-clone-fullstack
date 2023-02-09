import { NextFunction, Request, Response } from 'express'
import { EditTodoOrderSchema } from './dateColumn.model'

import * as dateColumnService from './dateColumn.service'

export const getDateColumns = async (
  req: Request<{}, {}, {}, { ids: string }>,
  res: Response,
  next: NextFunction,
) => {
  const ids = req.query.ids.split(';')
  try {
    const dateColumns = await dateColumnService.getDateColumns({
      ids,
    })
    return res.status(200).json(dateColumns)
  } catch (error) {
    return next(error)
  }
}

export const editTodoOrder = async (
  req: Request<{ id: string }, {}, EditTodoOrderSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dateColumn = await dateColumnService.editTodoOrder({
      id: req.params.id,
      todoOrder: req.body.todoOrder,
    })
    return res.status(200).json(dateColumn)
  } catch (error) {
    return next(error)
  }
}
