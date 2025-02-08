import { Response } from 'express'
import { IUser } from '../../models/user.model'
import { RefreshTokenRepository } from '../../repositories/refreshToken.repository'
import { UserRepository } from '../../repositories/user.repository'
import {
    BadRequestError,
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from '../../shared/errors/errors'
import { comparePassword, hashPassword } from '../../shared/helpers/password'
import { ID } from '../../shared/types/id.type'
import { clearCookieToken } from '../../shared/utils/cookies'
import {
    createJwtToken,
    createRefreshToken,
    setTokensOnResponse,
    verifyRefreshToken,
} from '../../shared/utils/token'
import { RegisterUserDTO } from './auth.dtos'
import { LoginResponse, SignUpResponse } from './auth.types'

const userRepository = new UserRepository()
const refreshTokenRepository = new RefreshTokenRepository()

export const signUp = async (
    data: RegisterUserDTO,
    res: Response,
): Promise<SignUpResponse> => {
    const { email } = data
    if (email) {
        const existingUser = await userRepository.findOne({ email })
        if (existingUser) throw new ConflictError('EMAIL ALREADY IN USE')
    }

    const user = userRepository.init(data)
    user.password = await hashPassword(data.password)

    const newUser: IUser = await userRepository.create(user)
    const accessToken = createJwtToken(newUser._id, newUser.role)
    const refreshToken = createRefreshToken(newUser._id, newUser.role)

    await refreshTokenRepository.create({
        userId: newUser._id,
        token: refreshToken,
    })
    setTokensOnResponse(res, accessToken, refreshToken)

    return {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
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

    await refreshTokenRepository.deleteMany({ userId: user._id })

    const accessToken = createJwtToken(user._id, user.role)
    const refreshToken = createRefreshToken(user._id, user.role)

    await refreshTokenRepository.create({
        userId: user._id,
        token: refreshToken,
    })
    setTokensOnResponse(res, accessToken, refreshToken)

    return {
        accessToken,
        user: {
            _id: user._id,
            fullname: user.fullname,
            role: user.role,
        },
    }
}

export const logout = async (userId: ID, res: Response): Promise<void> => {
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
    const user = await userRepository.findById(userId)
    if (!user) throw new NotFoundError('USER NOT FOUND')

    const storedRefreshToken = await refreshTokenRepository.findOne({
        userId,
        token: oldRefreshToken,
    })
    if (!storedRefreshToken)
        throw new UnauthorizedError('REFRESH TOKEN NOT VALID')

    const newAccessToken = createJwtToken(user._id, user.role)
    const newRefreshToken = createRefreshToken(user._id, user.role)

    await refreshTokenRepository.findOneAndUpdate(
        { _id: storedRefreshToken._id },
        { token: newRefreshToken },
    )

    setTokensOnResponse(res, newAccessToken, newRefreshToken)

    return {
        accessToken: newAccessToken,
        user: {
            _id: user._id,
            fullname: user.fullname,
            role: user.role,
        },
    }
}
