import { Column, Entity, JoinColumn, ManyToOne, RelationId } from 'typeorm'
import { AbstractEntity } from './abstract.entity'
import { User } from './user.entity'

@Entity('refresh_tokens')
export class RefreshToken extends AbstractEntity {
    @ManyToOne(() => User, user => user.refreshTokens, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User

    @RelationId((refreshToken: RefreshToken) => refreshToken.user)
    user_id: string

    @Column({ type: 'text', nullable: false })
    token: string
}
