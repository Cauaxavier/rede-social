import { Request, Response } from 'express'
import { StatusCodes as HttpStatus } from 'http-status-codes'
import path from 'path'
import { z } from 'zod'
import { ProfileSchema } from '../schemas/profileSchema'
import { prismaClient } from '../config/prismaClient'
import fs from 'fs/promises'

interface CustomError extends Error {
    code?: string;
  }

export default {
    async create(req: Request, res: Response) {
        const data = ProfileSchema.parse(req.body)
        const image = req.file
        const userId = req.userId

        try {
            const profile = await prismaClient.profile.create({
                data: {
                    userName: data.userName,
                    photo: image?.filename,
                    description: data.description,
                    user: {
                        connect: {
                            id: userId
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

    },

    async getPhoto(req: Request, res: Response) {
        const { name: string } = req.params

        const image = path.join(process.cwd(), 'images', string)

        try {

            await fs.access(image)
        
            return res.sendFile(image)

        } catch (error) {

            const customError = error as CustomError    

            if (customError.code === 'ENOENT') {
                // Arquivo não encontrado
                return res.status(404).json({ message: 'Image not found'});
            }

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error in server" })
        }
    }
}