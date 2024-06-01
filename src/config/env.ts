import dotenv from 'dotenv'

dotenv.config()

export default {
    port: Number(process.env.PORT),

    jwt: {
        secretKey: process.env.JWT_PASS!,
        options: {
            expiresIn: '1d'
        }
    },
}