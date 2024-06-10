import Router from 'express'
import postController from '../controllers/postController'
import multer from '../utils/multer'

const postRouter = Router()

postRouter.post('/post/create/:profileId', multer.array('images'), postController.create)

export default postRouter