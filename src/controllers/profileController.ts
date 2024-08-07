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

async function create(req: Request, res: Response) {
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
}

async function getPhoto(req: Request, res: Response) {
    const { name: string } = req.params

    const image = path.join(process.cwd(), 'images', string)

    try {

        await fs.access(image)
    
        return res.sendFile(image)

    } catch (error) {

        const customError = error as CustomError    

        if (customError.code === 'ENOENT') {
            // Arquivo não encontrado
            return res.status(HttpStatus.NOT_FOUND).json({ message: 'Image not found'});
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error in server" })
    }
}

async function getProfile(req: Request, res: Response)  {
    const { id } = req.params

    try {
        const profile = await prismaClient.profile.findFirst({
            where: {
                id
            },

            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        isActive: true,
                        createdAt: true
                    }
                }
            }
        })

        return res.status(HttpStatus.OK).json({ profile })

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

async function updateProfile(req: Request, res: Response) {
    const { userName, description } = ProfileSchema.parse(req.body)
    const { id } = req.params
    const image = req.file


    try {
        const profile = await prismaClient.profile.findFirst({
            where: {
                id
            }
        })

        const existsUsername = await prismaClient.profile.findFirst({
            where: {
                userName
            }
        })

        //@ts-ignore
        if (existsUsername && profile.userName !== userName) {
            return res.status(HttpStatus.CONFLICT).json({ message: "Username already exists" })
        }

        //@ts-ignore
        await fs.unlink(`images/${profile.photo}`)

        await prismaClient.profile.update({
            where: {
                id
            },

            data: {
                userName,
                description,
                photo: image?.filename
            }
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

export default {
    create,
    getPhoto,
    getProfile,
    updateProfile
}