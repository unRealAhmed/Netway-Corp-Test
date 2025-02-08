import User, { IUser } from '../models/user.model'
import { ID } from '../shared/types/id.type'
import { AbstractRepository } from './abstract.repository'

export class UserRepository extends AbstractRepository<IUser> {
    constructor() {
        super(User)
    }

    init(data: Partial<IUser>) {
        return new User(data)
    }

    findByEmail(email: string) {
        return this.model.findOne({ email }).select('+password').exec()
    }

    updatePassword(id: ID, password: string) {
        return this.model
            .findByIdAndUpdate(id, { password })
            .exec() as unknown as IUser
    }
}
