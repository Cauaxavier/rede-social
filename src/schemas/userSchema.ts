import { z } from 'zod'

const UserSchema = z.object({
    id: z.string().optional(),
    name: z.string({ message: "name is required"}),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(5, { message: "Password must be at least 5 characters long" }),
    isActive: z.boolean().optional()
})

const LoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }), 
    password: z.string({ message: "Invalid email address" }),
})

export { UserSchema, LoginSchema }