import { Request, Response, NextFunction } from 'express'
import { StatusCodes as HttpStatus } from 'http-status-codes'
import { z } from 'zod'
import { verifyToken } from '../config/authAdminToken'
import jwt from 'jsonwebtoken'

export default async (req: Request, res: Response, next: NextFunction) => {

        try {
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
    
            console.log("Id: ", id);
            
            req.userId = id
        } catch (error) {

            if (error instanceof jwt.TokenExpiredError) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Token expired!" })
            } else if (error instanceof jwt.JsonWebTokenError) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid token!" })
            }

            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error in server" })
        }

        next()
}
