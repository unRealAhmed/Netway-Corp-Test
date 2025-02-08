import { Response } from 'express'
import configService from '../../config/config.service'

export function setCookieToken(res: Response, token: string): void {
    const options = {
        httpOnly: true,
        secure: configService.getNodeEnv() !== 'development',
        sameSite: 'strict' as const,
        maxAge: 60 * 60 * 1000,
    }

    res.cookie('jwt', token, options)
}

export function clearCookieToken(res: Response): void {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: configService.getNodeEnv() === 'production',
    })
    res.clearCookie('refreshJwt', {
        httpOnly: true,
        secure: configService.getNodeEnv() === 'production',
    })
}
