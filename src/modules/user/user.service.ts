import { ConflictError, NotFoundError } from '@common/errors'
import { UpdateUserBody } from '@modules/user/dto'
import UserRepository from '@modules/user/user.repository'

class UserService {
  static async getUserInfo(id: string) {
    const user = await UserRepository.getUserById(id)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    return user
  }

  static async updateUserInfo(id: string, dto: Partial<UpdateUserBody>) {
    const user = await UserRepository.getUserById(id)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    const userWithSameUsername = dto.username && (await UserRepository.getUserByUsername(dto.username))
    if (userWithSameUsername && userWithSameUsername.id !== id) {
      throw new ConflictError('Username already taken')
    }

    await UserRepository.updateUser(id, dto)

    const updatedUser = await UserRepository.getUserById(id)
    if (!updatedUser) {
      throw new NotFoundError('User not found')
    }

    return updatedUser
  }
}

export default UserService
