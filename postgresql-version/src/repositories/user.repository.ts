import { DataSource } from 'typeorm'
import { User } from '../entities/user.entity'
import { AbstractRepository } from './abstract.repository'

export class UserRepository extends AbstractRepository<User> {
    constructor(dataSource: DataSource) {
        super(User, dataSource)
    }

    createUser(data: Partial<User>): User {
        return this.create(data)
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.createQueryBuilder('user')
            .where('user.email = :email', { email })
            .addSelect('user.password')
            .getOne()
    }

    async updatePassword(id: string, password: string): Promise<User | null> {
        await this.createQueryBuilder()
            .update(User)
            .set({ password })
            .where('id = :id', { id })
            .execute()

        return this.findOne({ where: { id } })
    }
}
