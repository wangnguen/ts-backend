import { z } from 'zod/v4'

export const UpdateUserBodySchema = z
  .object({
    username: z.string().min(3).max(30),
    fullName: z.string().min(1).max(255)
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required'
  })

export type UpdateUserBody = z.infer<typeof UpdateUserBodySchema>
