import { Router } from 'express'
import profileController from '../controllers/profileController'
import multer from '../utils/multer'

const profileRouter = Router()

profileRouter.post('/profile/create', multer.single('image'), profileController.create)
profileRouter.get('/profile/photo/:name', profileController.getPhoto)

export default profileRouter