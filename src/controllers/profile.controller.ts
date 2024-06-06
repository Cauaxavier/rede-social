import { Request, Response } from 'express'
import { StatusCodes as HttpStatus } from 'http-status-codes'
import { z } from 'zod'
import { ProfileSchema } from '../schemas/profileSchema'
import { prismaClient } from '../config/prismaClient'

export default {
    async create(req: Request, res: Response) {
        const data = ProfileSchema.parse(req.body)
        console.log(req.userId);
        
        data.userId = req.userId!

        try {
            const profile = await prismaClient.profile.create({
                data: {
                    userName: data.userName,
                    photo: data.photo,
                    description: data.description,
                    user: {
                        connect: {
                            id: data.userId
                        }
                    }
                }
            })   

            return res.status(HttpStatus.CREATED).json({ profile })

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