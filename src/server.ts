import express from 'express'

import userRouter from './routers/userRouter'
import env from './config/env'

const app = express()

app.use(express.json())
app.use(userRouter)

app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`)
})
