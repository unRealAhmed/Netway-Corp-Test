import { Response } from 'express'
import { AppDataSource } from '../../config/dataBase'
import { RefreshTokenRepository } from '../../repositories/refreshToken.repository'
import { UserRepository } from '../../repositories/user.repository'
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from '../../shared/errors/errors'
import { comparePassword, hashPassword } from '../../shared/helpers/password'
import { clearCookieToken } from '../../shared/utils/cookies'
import {
    createJwtToken,
    createRefreshToken,
    setTokensOnResponse,
    verifyRefreshToken,
} from '../../shared/utils/token'
import { RegisterUserDTO } from './auth.dtos'
import { LoginResponse, SignUpResponse } from './auth.types'

const userRepository = new UserRepository(AppDataSource)
const refreshTokenRepository = new RefreshTokenRepository(AppDataSource)

export const signUp = async (
    data: RegisterUserDTO,
    res: Response,
): Promise<SignUpResponse> => {
    const { email } = data

    const existingUser = await userRepository.findOne({ where: { email } })
    if (existingUser) throw new ConflictError('EMAIL ALREADY IN USE')

    const user = userRepository.createUser(data)
    user.password = await hashPassword(data.password)

    const newUser = await userRepository.save(user)

    const accessToken = createJwtToken(newUser.id, newUser.role)
    const refreshToken = createRefreshToken(newUser.id, newUser.role)

    refreshTokenRepository.save({
        user: newUser,
        token: refreshToken,
    })

    setTokensOnResponse(res, accessToken, refreshToken)

    return {
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
        accessToken,
    }
}

export const login = async (
    email: string,
    password: string,
    res: Response,
): Promise<LoginResponse> => {
    const user = await userRepository.findByEmail(email)
    if (!user) throw new BadRequestError('WRONG EMAIL OR PASSWORD')

    const isPasswordCorrect = await comparePassword(password, user.password)
    if (!isPasswordCorrect) throw new BadRequestError('WRONG EMAIL OR PASSWORD')

    const accessToken = createJwtToken(user.id, user.role)
    const refreshToken = createRefreshToken(user.id, user.role)

    refreshTokenRepository.save({
        user: user,
        token: refreshToken,
    })

    setTokensOnResponse(res, accessToken, refreshToken)

    return {
        accessToken,
        user: {
            id: user.id,
            fullname: user.fullname,
            role: user.role,
        },
    }
}

export const logout = async (userId: string, res: Response): Promise<void> => {
    await refreshTokenRepository.deleteByUserId(userId)
    clearCookieToken(res)
}

export const refreshToken = async (
    oldRefreshToken: string,
    res: Response,
): Promise<LoginResponse> => {
    const tokenPayload = verifyRefreshToken(oldRefreshToken)
    if (!tokenPayload) throw new UnauthorizedError('INVALID REFRESH TOKEN')

    const { id: userId } = tokenPayload

    const user = await userRepository.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundError('USER NOT FOUND')
    const storedRefreshToken = await refreshTokenRepository.findOne({
        where: { token: oldRefreshToken },
    })
    if (!storedRefreshToken || storedRefreshToken.user_id != userId)
        throw new UnauthorizedError('REFRESH TOKEN NOT VALID')

    const newAccessToken = createJwtToken(user.id, user.role)
    const newRefreshToken = createRefreshToken(user.id, user.role)

    await refreshTokenRepository.updateBy(
        { id: storedRefreshToken.id },
        { token: newRefreshToken },
    )

    setTokensOnResponse(res, newAccessToken, newRefreshToken)

    return {
        accessToken: newAccessToken,
        user: {
            id: user.id,
            fullname: user.fullname,
            role: user.role,
        },
    }
}
