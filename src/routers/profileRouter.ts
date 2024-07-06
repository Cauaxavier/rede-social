import { Router } from 'express'
import profileController from '../controllers/profileController'
import multer from '../utils/multer'

const profileRouter = Router()

profileRouter.post('/profile/create', multer.single('image'), profileController.create)
profileRouter.get('/profile/photo/:name', profileController.getPhoto)
profileRouter.get('/profile/:id', profileController.getProfile)
profileRouter.put('/profile/update/:id', multer.single('image'),profileController.updateProfile)

export default profileRouter