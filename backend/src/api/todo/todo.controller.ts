import { NextFunction, Request, Response } from 'express'
import * as todoService from './todo.service'
import { DeleteTodoSchema } from './todo.model'

export const getTodos = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const todos = await todoService.getTodos()
    return res.status(200).json(todos)
  } catch (error: any) {
    return next(error)
  }
}

export const addTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newTodo = await todoService.addTodo(req.body)
    return res.status(200).json(newTodo)
  } catch (error) {
    return next(error)
  }
}

export const editTodo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { text, checked } = req.body
    const todo = await todoService.editTodo({
      id: parseInt(req.params.id, 10),
      text,
      checked,
    })
    return res.status(200).json(todo)
  } catch (error) {
    return next(error)
  }
}

export const deleteTodo = async (
  req: Request<{ id: string }, {}, DeleteTodoSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deletedTodo = await todoService.deleteTodo({
      id: parseInt(req.params.id, 10),
      ...req.body,
    })
    return res.status(200).json(deletedTodo)
  } catch (error) {
    return next(error)
  }
}
