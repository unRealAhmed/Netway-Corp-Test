import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { CustomError } from '../shared/errors/customError'

export const validate = (schemas: any[]) => {
    return [
        ...schemas,
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(
                    new CustomError(400, 'Validation failed', errors.array()),
                )
            }
            next()
        },
    ]
}
