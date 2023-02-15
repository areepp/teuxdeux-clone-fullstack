/* eslint-disable no-redeclare */
import { z } from 'zod'

const Todo = z.object({
  id: z.number(),
  text: z.string(),
  checked: z.boolean(),
})

export const GetTodoSchema = z.object({
  ids: z.string(),
})

export const EditTodoSchema = z.object({
  text: z.string().optional(),
  checked: z.boolean().optional(),
})

export const AddTodoSchema = z.object({
  text: z.string(),
  listId: z.number().optional(),
  dateColumnId: z.string().optional(),
})

export const DeleteTodoSchema = z.object({
  listId: z.number().optional(),
  dateColumnId: z.string().optional(),
})

type Todo = z.infer<typeof Todo>
export type DeleteTodoSchema = z.infer<typeof DeleteTodoSchema>

export default Todo
