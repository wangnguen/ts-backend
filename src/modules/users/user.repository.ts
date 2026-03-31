import AppDataSource from '@databases/data-source'
import { CreateUserBody, PaginationQuery, UpdateUserBody } from './user.dto'
import { User } from '@entities/user.entity'

class UserRepository {
  private static get repo() {
    return AppDataSource.getDataSource().getRepository(User)
  }

  static create(data: CreateUserBody) {
    return this.repo.insert(data)
  }

  static findAndCount(pagination: PaginationQuery) {
    return this.repo.findAndCount({
      take: pagination.limit,
      skip: pagination.offset,
      order: { createdAt: 'DESC' }
    })
  }

  static update(id: string, data: UpdateUserBody) {
    return this.repo.update(id, data)
  }

  static softDelete(id: string) {
    return this.repo.softDelete(id)
  }

  static findByUsername(username: string) {
    return this.repo.findOne({ where: { username } })
  }

  static findById(id: string) {
    return this.repo.findOne({ where: { id } })
  }

  static findByEmail(email: string) {
    return this.repo.findOne({ where: { email } })
  }
}

export default UserRepository
