import crypto from 'crypto'
import { Response } from 'express'
import jwt from 'jsonwebtoken'
import configService from '../../config/config.service'

type TokenPayload = {
    id: string
    role: string
}

type PasswordResetToken = {
    resetToken: string
    hashedToken: string
    expiresAt: Date
}

export function createJwtToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, configService.getJwtSecret(), {
        expiresIn: '15m',
    })
}

export function createRefreshToken(userId: string, role: string): string {
    return jwt.sign({ id: userId, role }, configService.getJwtRefreshSecret(), {
        expiresIn: '15d',
    })
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(
            token,
            configService.getJwtSecret() as string,
        ) as TokenPayload
    } catch (error) {
        return null
    }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(
            token,
            configService.getJwtRefreshSecret() as string,
        ) as TokenPayload
    } catch {
        return null
    }
}

export function setTokensOnResponse(
    res: Response,
    accessToken: string,
    refreshToken: string,
): void {
    res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: configService.getNodeEnv() === 'production',
        maxAge: 15 * 60 * 1000,
    })
    res.cookie('refreshJwt', refreshToken, {
        httpOnly: true,
        secure: configService.getNodeEnv() === 'production',
        maxAge: 15 * 24 * 60 * 60 * 1000,
    })
}

export function createPasswordResetToken(): PasswordResetToken {
    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    return { resetToken, hashedToken, expiresAt }
}
