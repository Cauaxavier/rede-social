import { sign, verify } from 'jsonwebtoken'
import env from '../config/env'

const createToken = (userId: {id: string}) => {
    return sign(userId, env.jwt.secretKey, env.jwt.options)
}

const verifyToken = (token: string) => {
    return verify(token, env.jwt.secretKey)
}

export { createToken, verifyToken }