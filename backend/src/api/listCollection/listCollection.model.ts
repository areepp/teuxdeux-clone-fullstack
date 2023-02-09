import { z } from 'zod'
import List from '../list/list.model'

const ListCollection = z.object({
  id: z.number(),
  lists: z.array(List).nullable(),
  listOrder: z.array(z.number()),
  userId: z.string(),
})

type ListCollection = z.infer<typeof ListCollection>

export default ListCollection
