import { Request, Response, NextFunction } from 'express'
import { StatusCodes as HttpStatus } from 'http-status-codes'
import { z } from 'zod'
import { verifyToken } from '../config/authAdminToken'

export default async (req: Request, res: Response, next: NextFunction) => {
        const bearer = req.headers.authorization

        if (!bearer) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Token don't send!" })
        }

        const idSchema = z.object({
            id: z.string().cuid()
        })

        const token = bearer.split(' ')[1]
        const { id } = idSchema.parse(verifyToken(token))

        if (!id) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: "User unauthorized!" })
        }

        req.userId = id

        next()
}
