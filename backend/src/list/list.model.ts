import { z } from 'zod'

const List = z.object({
  id: z.number(),
  title: z.string(),
  todoOrder: z.array(z.number()),
})

export const PostListSchema = z.object({
  listCollectionId: z.number(),
})

export const EditListSchema = z.object({
  title: z.string().optional(),
  todoOrder: z.array(z.number()).optional(),
})

export const DeleteListSchema = z.object({
  listCollectionId: z.number(),
})

type List = z.infer<typeof List>
export type PostListSchema = z.infer<typeof PostListSchema>
export type EditListSchema = z.infer<typeof EditListSchema>
export type DeleteListSchema = z.infer<typeof DeleteListSchema>

export default List
