import { z } from 'zod'

const Todo = z.object({
  id: z.string(),
  text: z.string(),
  checked: z.boolean(),
})

type Todo = z.infer<typeof Todo>

export default Todo
