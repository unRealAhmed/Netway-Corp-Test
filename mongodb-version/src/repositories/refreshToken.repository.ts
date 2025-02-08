import { IRefreshToken, RefreshToken } from '../models/refreshToken.model'
import { ID } from '../shared/types/id.type'
import { AbstractRepository } from './abstract.repository'

export class RefreshTokenRepository extends AbstractRepository<IRefreshToken> {
    constructor() {
        super(RefreshToken)
    }

    async deleteByUserId(userId: ID) {
        return RefreshToken.deleteMany({ userId })
    }
}
