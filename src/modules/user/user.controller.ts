import { UpdateUserBody } from '@modules/user/dto'
import UserService from '@modules/user/user.service'
import { Request, Response } from 'express'

class UserController {
  static async getUserInfo(req: Request, res: Response) {
    const userId = req.user?.id as string
    const user = await UserService.getUserInfo(userId)
    res.ok(user)
  }

  static async updateUserInfo(req: Request, res: Response) {
    const userId = req.user?.id as string
    const updateData = req.body as UpdateUserBody
    const updatedUser = await UserService.updateUserInfo(userId, updateData)
    res.ok(updatedUser)
  }
}

export default UserController
