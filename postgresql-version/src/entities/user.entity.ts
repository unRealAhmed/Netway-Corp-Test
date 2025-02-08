import { Column, Entity, OneToMany } from 'typeorm'
import { RolesEnum, RolesType } from '../shared/types/roles'
import { AbstractEntity } from './abstract.entity'
import { RefreshToken } from './refreshToken.entity'

@Entity('users')
export class User extends AbstractEntity {
    @Column({ type: 'varchar', length: 50, nullable: false })
    fullname: string

    @Column({ type: 'varchar', unique: true, nullable: false })
    email: string

    @Column({ type: 'varchar', nullable: false, select: false })
    password: string

    @Column({ type: 'enum', enum: RolesEnum, default: RolesEnum.USER })
    role: RolesType

    @OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
    refreshTokens: RefreshToken[]
}
