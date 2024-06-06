import { Request, Response } from 'express'
import { StatusCodes as HttpStatus } from 'http-status-codes'
import { hash, compare } from 'bcrypt'
import { z } from 'zod'
import { prismaClient } from "../config/prismaClient"
import { UserSchema, LoginSchema } from  '../schemas/userSchema'
import { createToken } from '../config/authAdminToken'

export default {
    async register(req: Request, res: Response) {
        
        try {
            const { name, password, email } = UserSchema.parse(req.body)
            
            const encryptedPassword = await hash(password, 10)

            const userExists = await prismaClient.user.findFirst({
                where: {
                    email
                }
            })

            if (userExists) {
                return res.status(HttpStatus.CONFLICT).json({ message: "User already exists" })
            }    

            const user = await prismaClient.user.create({
                data: {
                    name,
                    password: encryptedPassword,
                    email
                }
            })

            const { password: _, ...dataUser } = user

            return res.status(HttpStatus.CREATED).json({user: dataUser})

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

    async login(req: Request, res: Response) {
        
        try {
            const {email, password} = LoginSchema.parse(req.body)
            
            const user = await prismaClient.user.findFirst({
                where: {
                    email
                }
            })
    
            if (!user) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Incorrect email or password." })
            }    
    
            const isCorrectPassord = await compare(password, user.password)
    
            if (!isCorrectPassord) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Incorrect email or password." })
            }    
    
            const token = createToken({ id: user.id })
    
            const { password: _, ...dataUser } = user
    
            return res.status(HttpStatus.ACCEPTED).json({ user: dataUser,token })
            
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