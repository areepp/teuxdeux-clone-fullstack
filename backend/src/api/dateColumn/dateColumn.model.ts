/* eslint-disable no-redeclare */
import { z } from 'zod'
import Todo from '../todo/todo.model'

const DateColumn = z.object({
  id: z.number(),
  todos: z.array(Todo),
  todoOrder: z.array(z.number()),
})

export const GetDateColumnsSchema = z.object({
  ids: z.string(),
})

export const EditTodoOrderSchema = z.object({
  todoOrder: z.array(z.number()),
})

type DateColumn = z.infer<typeof DateColumn>
export type GetDateColumnsSchema = z.infer<typeof GetDateColumnsSchema>
export type EditTodoOrderSchema = z.infer<typeof EditTodoOrderSchema>

export default DateColumn
