import { z } from 'zod'

const ProfileSchema = z.object({
    id: z.string().optional(),
    userName: z.string({ message: "Username is required"}),
    photo: z.string().optional(),
    description: z.string().optional(),
    isVerified: z.boolean().optional(),
    userId: z.string().optional()
})

export { ProfileSchema }