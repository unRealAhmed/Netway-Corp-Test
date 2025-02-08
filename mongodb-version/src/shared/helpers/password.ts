import bcrypt from 'bcryptjs'
import configService from '../../config/config.service'

export const hashPassword = function (password: string) {
    const salt = Number(configService.getSalt())
    return bcrypt.hash(password, salt)
}

export const comparePassword = function (
    plainPassword: string,
    hashedPassword: string,
) {
    return bcrypt.compare(plainPassword, hashedPassword)
}
