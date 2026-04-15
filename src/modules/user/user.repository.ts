import AppDataSource from '@databases/data-source'
import { User } from '@entities/user.entity'

class UserRepository {
  static getUserById(id: string) {
    return this.userRepo.findOne({ where: { id } })
  }

  static getUserByUsername(username: string) {
    return this.userRepo.findOne({ where: { username } })
  }

  static updateUser(id: string, updateData: Partial<Pick<User, 'username' | 'fullName'>>) {
    return this.userRepo.update({ id }, updateData)
  }

  private static get userRepo() {
    return AppDataSource.getDataSource().getRepository(User)
  }
}

export default UserRepository
