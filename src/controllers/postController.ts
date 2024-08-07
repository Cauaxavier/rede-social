import { Request, Response } from 'express'
import { PostSchema, CommentSchema } from '../schemas/postSchema'
import { prismaClient } from '../config/prismaClient'
import { StatusCodes as HttpStatus } from 'http-status-codes'
import { z } from 'zod'
import fs from 'fs/promises'

async function create(req: Request, res: Response) {
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

async function getPost(req: Request, res: Response) {
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
}

async function comment(req: Request, res: Response) {
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

async function exclusion(req: Request, res: Response) {
    const { postId } = req.params

    try {

        const images = await prismaClient.image.findMany({
            where: {
                postId
            },

            select: {
                name: true
            }
        })

        for (const image of images) {
            await fs.unlink(`images/${image.name}`)
        }
        
        await prismaClient.image.deleteMany({
            where: {
                postId: postId
            },
        })
        
        await prismaClient.comment.deleteMany({
            where: {
                postId: postId
            }
        })
        
        await prismaClient.post.delete({
            where: {
                id: postId
            },
        })

        return res.status(HttpStatus.NO_CONTENT).json()

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

async function like(req: Request, res: Response) {
    const { postId } = req.params

    try {
        await prismaClient.post.update({

            data: {
                likes: {
                    increment: 1
                }
            },

            where: {
                id: postId
            }
        })

        return res.status(HttpStatus.OK).json()

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

export default {
    create,
    getPost,
    comment,
    exclusion,
    like
}