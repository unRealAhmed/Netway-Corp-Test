import { NextFunction, Request, Response } from 'express'
import { ForbiddenError } from '../shared/errors/errors'

export function authorizeRoles(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user

        if (!user) {
            return next(new ForbiddenError('Unauthorized'))
        }

        if (!allowedRoles.includes(user?.role)) {
            return next(new ForbiddenError('Access denied'))
        }

        next()
    }
}
