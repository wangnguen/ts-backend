import { Router } from 'express'
import UserController from './user.controller'
import { validateBody } from '@common/middlewares'
import { UpdateUserBodySchema } from '@modules/user/dto'

const router = Router()

router.get('/me', UserController.getUserInfo)
router.patch('/me', validateBody(UpdateUserBodySchema), UserController.updateUserInfo)

export default router
