import { z } from 'zod'

const UserSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string(),
    isActive: z.boolean().optional()
})

export { UserSchema }