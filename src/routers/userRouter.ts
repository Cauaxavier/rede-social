import { Router } from 'express'
import userController from '../controllers/userController'
import authMiddleware from '../middlewares/authMiddleware'

const userRouter = Router()

userRouter.post('/user/register', userController.register)
userRouter.post('/user/login', userController.login)

userRouter.use(authMiddleware)

userRouter.post('/user/me', userController.getUser)
userRouter.post('/user/inactivate', userController.inactivateUser)

export default userRouter