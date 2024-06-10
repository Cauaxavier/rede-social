import { Request, Response } from 'express'
import { PostSchema } from '../schemas/postSchema'
import { prismaClient } from '../config/prismaClient'
import { StatusCodes as HttpStatus } from 'http-status-codes'
import { z } from 'zod'

export default {
    async create(req: Request, res: Response) {
        const { description } = PostSchema.parse(req.body)
        const { profileId } = req.params
        const images = req.files
        
        try {
            const post = await prismaClient.post.create({
                data: {
                    description,
                    profile: {
                        connect: {
                            id: profileId
                        }
                    }
                }
            })
            
            // @ts-ignore
            for (const image of images) {
                await prismaClient.image.create({
                    data: {
                        name: image.filename,
                        post: {
                            connect: {
                                id: post.id
                            }
                        }
                    }
                })
            }

            return res.status(HttpStatus.CREATED).json({ post })
            
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors = error.errors.map(err => ({
                  field: err.path.join('.'),
                  message: err.message,
                }));
                return res.status(HttpStatus.BAD_REQUEST).json({ errors });
            }       
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error in server" })
        }
    }
}