import * as todoService from './todo.service'
import { Request, Response } from 'express'
import { DeleteTodoSchema } from './todo.model'

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await todoService.getTodos()
    return res.status(200).json(todos)
  } catch (error: any) {
    return res.status(500).json(error.message)
  }
}

export const addTodo = async (req: Request, res: Response) => {
  try {
    const newTodo = await todoService.addTodo(req.body)
    return res.status(200).json(newTodo)
  } catch (error) {
    return res.json(error)
  }
}

export const editTodo = async (req: Request, res: Response) => {
  try {
    const { text, checked } = req.body
    const todo = await todoService.editTodo({
      id: parseInt(req.params.id),
      text,
      checked,
    })
    return res.status(200).json(todo)
  } catch (error) {
    return res.json(error)
  }
}

export const deleteTodo = async (
  req: Request<{ id: string }, {}, DeleteTodoSchema>,
  res: Response,
) => {
  try {
    const deletedTodo = await todoService.deleteTodo({
      id: parseInt(req.params.id),
      ...req.body,
    })
    return res.status(200).json(deletedTodo)
  } catch (error) {
    return res.json(error)
  }
}
