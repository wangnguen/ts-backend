import { Router } from 'express'
import UserController from './user.controller'
import { CreateUserBodySchema, PaginationQuerySchema, UpdateUserBodySchema, UuidParamSchema } from './user.dto'
import { validateBody, validateParam, validateQuery } from '@common/middlewares'

const router = Router()

router.get('/', validateQuery(PaginationQuerySchema), UserController.getUsers)

router.post('/', validateBody(CreateUserBodySchema), UserController.createUser)

router.patch('/:id', validateParam(UuidParamSchema), validateBody(UpdateUserBodySchema), UserController.updateUser)

router.delete('/:id', validateParam(UuidParamSchema), UserController.deleteUser)

router.get('/:id', validateParam(UuidParamSchema), UserController.getUserById)

export default router
