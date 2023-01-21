import * as todoService from './todo.service'
import { Request, Response } from 'express'

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await todoService.getTodos()
    return res.status(200).json(todos)
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}
