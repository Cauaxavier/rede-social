import { Router } from 'express'
import profileController from '../controllers/profile.controller'

const profileRouter = Router()

profileRouter.post('/profile/create', profileController.create)

export default profileRouter