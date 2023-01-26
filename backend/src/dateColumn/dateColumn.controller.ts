import { Request, Response } from 'express'
import { EditTodoOrderSchema, GetDateColumnsSchema } from './dateColumn.model'

import * as dateColumnService from './dateColumn.service'

export const getDateColumns = async (
  req: Request<{}, {}, GetDateColumnsSchema>,
  res: Response,
) => {
  try {
    const dateColumns = await dateColumnService.getDateColumns({
      ids: req.body.ids,
    })
    return res.status(200).json(dateColumns)
  } catch (error) {
    return res.json(error)
  }
}

export const editTodoOrder = async (
  req: Request<{ id: string }, {}, EditTodoOrderSchema>,
  res: Response,
) => {
  try {
    const dateColumn = await dateColumnService.editTodoOrder({
      id: req.params.id,
      todoOrder: req.body.todoOrder,
    })
    return res.status(200).json(dateColumn)
  } catch (error) {
    return res.json(error)
  }
}
