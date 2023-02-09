/* eslint-disable no-redeclare */
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

type List = z.infer<typeof List>
export type PostListSchema = z.infer<typeof PostListSchema>
export type EditListSchema = z.infer<typeof EditListSchema>

export default List
