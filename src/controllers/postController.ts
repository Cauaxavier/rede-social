import { Request, Response } from 'express'
import { PostSchema, CommentSchema } from '../schemas/postSchema'
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
    }, 

    async getPost(req: Request, res: Response) {
        const { profileId } = req.params

        try {
            
            const post = await prismaClient.post.findFirst({
                where: {
                    id: profileId
                }, 

                include: {
                    profile: true,
                    images: {
                        select: {
                            name: true
                        }
                    },
                    comments: true
                }
            })

            return res.status(HttpStatus.OK).json({ post })

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
    },

    async comment(req: Request, res: Response) {
        const { postId } = req.params
        const { description } = req.body

        try {

            const comment = await prismaClient.comment.create({
                data: {
                    description,
                    post: {
                        connect: {
                            id: postId
                        }
                    }
                }  
            })

            return res.status(HttpStatus.CREATED).json({ comment })
            
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