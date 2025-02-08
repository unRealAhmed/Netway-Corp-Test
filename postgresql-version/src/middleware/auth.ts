import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import configService from '../config/config.service'
import { AppDataSource } from '../config/dataBase'
import { UserRepository } from '../repositories/user.repository'
import { UnauthorizedError } from '../shared/errors/errors'

interface ITokenPayload {
    id: string
    fullname: string
    role: string
    iat: number
    exp: number
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string
                fullname: string
                role: string
            }
        }
    }
}

export async function extractUserFromToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    let token: string | undefined
    const userRepository = new UserRepository(AppDataSource)
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1]
    }

    if (!token && req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token) {
        return next(new UnauthorizedError('Invalid token'))
    }

    try {
        const decoded = jwt.verify(
            token,
            configService.getJwtSecret(),
        ) as ITokenPayload

        const user = await userRepository.findOneBy({ id: decoded.id })
        if (!user) {
            return next(new UnauthorizedError('User not found or inactive'))
        }

        req.user = {
            userId: user.id,
            fullname: user.fullname,
            role: user.role,
        }

        return next()
    } catch (error) {
        return next(new UnauthorizedError('Invalid or expired token'))
    }
}
