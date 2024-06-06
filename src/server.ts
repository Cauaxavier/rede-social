import express from 'express'

import userRouter from './routers/userRouter'
import env from './config/env'
import authMiddleware from './middlewares/authMiddleware'
import profileRouter from './routers/profileRouter'

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(authMiddleware)
app.use(profileRouter)

app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`)
})
