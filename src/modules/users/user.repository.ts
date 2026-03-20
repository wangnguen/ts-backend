import AppDataSource from '@databases/data-source'
import { CreateUserBody, UpdateUserBody } from './user.dto'
import { User } from '@entities/user.entity'

class UserRepository {
  private static appDataSource = AppDataSource.getDataSource()
  private static userRepository = this.appDataSource.getRepository(User)

  static create(data: CreateUserBody) {
    return this.userRepository.save(data)
  }
  static find() {
    return this.userRepository.find()
  }
  static update(id: string, data: UpdateUserBody) {
    return this.userRepository.update(id, data)
  }
  static delete(id: string) {
    return this.userRepository.delete(id)
  }

  static findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } })
  }

  static findById(id: string) {
    return this.userRepository.findOne({ where: { id } })
  }
  static findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } })
  }
}

export default UserRepository
