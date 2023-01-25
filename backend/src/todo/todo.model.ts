import { z } from 'zod'

const Todo = z.object({
  id: z.number(),
  text: z.string(),
  checked: z.boolean(),
})

export const EditTodoInput = z.object({
  text: z.string().optional(),
  checked: z.boolean().optional(),
})

export const AddTodoBody = z.object({
  text: z.string(),
  listId: z.number().optional(),
})

export const DeleteTodoBody = z.object({
  listId: z.number().optional(),
})

export const ArrayOfIdsInput = z.object({
  ids: z.array(z.number()),
})

type Todo = z.infer<typeof Todo>

export default Todo
