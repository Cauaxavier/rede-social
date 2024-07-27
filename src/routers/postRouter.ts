import Router from 'express'
import postController from '../controllers/postController'
import multer from '../utils/multer'

const postRouter = Router()

postRouter.post('/post/create/:profileId', multer.array('images', 10), postController.create)
postRouter.get('/post/:profileId', postController.getPost)
postRouter.post('/post/comment/:postId', postController.comment)
postRouter.patch('/post/like/:postId', postController.like)
postRouter.delete('/post/delete/:postId', postController.delete)

export default postRouter