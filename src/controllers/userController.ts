import { Request, Response } from 'express'
import { prismaClient } from "../config/prismaClient"
import { UserSchema } from  '../schemas/userSchema'
import { StatusCodes as HttpStatus } from 'http-status-codes'

export default {
    async register(req: Request, res: Response) {
        
        try {
            const { name, password, email } = UserSchema.parse(req.body)

            const user = await prismaClient.user.create({
                data: {
                    name,
                    password,
                    email
                }
            })

            const { password: _, ...dataUser } = user

            return res.status(HttpStatus.CREATED).json(dataUser)

        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error in server" })
        }

    }
}