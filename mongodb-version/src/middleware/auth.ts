import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import configService from '../config/config.service'
import { UserRepository } from '../repositories/user.repository'
import { UnauthorizedError } from '../shared/errors/errors'
import { ID } from '../shared/types/id.type'

interface ITokenPayload {
    id: ID
    fullname: string
    role: string
    iat: number
    exp: number
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: ID
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
    const userRepository = new UserRepository()
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

        const user = await userRepository.findById(decoded.id)
        if (!user) {
            return next(new UnauthorizedError('User not found or inactive'))
        }

        req.user = {
            userId: user._id,
            fullname: user.fullname,
            role: user.role,
        }

        return next()
    } catch (error) {
        return next(new UnauthorizedError('Invalid or expired token'))
    }
}
