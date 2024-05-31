import express from 'express'
import dotenv from 'dotenv'

import userRouter from './routers/userRouter'

dotenv.config()

const app = express()
const port = Number(process.env.PORT)

app.use(express.json())
app.use(userRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
