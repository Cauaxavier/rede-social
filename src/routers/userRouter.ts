import { Router } from 'express'
import userController from '../controllers/userController'

const userRouter = Router()

userRouter.post('/user/login', userController.login)
userRouter.post('/user/register', userController.register)

export default userRouter