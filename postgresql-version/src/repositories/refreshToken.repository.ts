import { DataSource } from 'typeorm'
import { RefreshToken } from '../entities/refreshToken.entity'
import { AbstractRepository } from './abstract.repository'

export class RefreshTokenRepository extends AbstractRepository<RefreshToken> {
    constructor(dataSource: DataSource) {
        super(RefreshToken, dataSource)
    }

    async deleteByUserId(userId: string): Promise<void> {
        await this.createQueryBuilder()
            .delete()
            .from(RefreshToken)
            .where('user_id = :userId', { userId })
            .execute()
    }
}
