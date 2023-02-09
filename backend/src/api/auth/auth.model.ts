import { z } from 'zod'

const User = z.object({
  id: z.string(),
  email: z.string().email(),
})

export const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type User = z.infer<typeof User>
export type AuthSchema = z.infer<typeof AuthSchema>

export default User
