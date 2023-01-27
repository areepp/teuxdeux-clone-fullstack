import { z } from 'zod'

const User = z.object({
  id: z.string(),
  email: z.string().email(),
})

export const SignUpUserSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type User = z.infer<typeof User>
export type SignUpUserSchema = z.infer<typeof SignUpUserSchema>

export default User
