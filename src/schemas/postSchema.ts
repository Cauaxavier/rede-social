import { z } from 'zod'

const PostSchema = z.object({
    id: z.string().optional(),
    description: z.string().optional(),
    likes: z.number().optional(),
    profileId: z.string().optional()
})

export { PostSchema }