import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { QueryFailedError } from 'typeorm'
import { CustomError } from '../shared/errors/customError'

export const globalErrorHandler: ErrorRequestHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
        res.status(400).json(
            formatErrorResponse(
                400,
                'Validation failed',
                validationErrors.array(),
            ),
        )
        return
    }

    if (err instanceof CustomError) {
        res.status(err.statusCode).json(
            formatErrorResponse(err.statusCode, err.message, err.details),
        )
        return
    }

    if (err instanceof QueryFailedError) {
        res.status(400).json(
            formatErrorResponse(
                400,
                'Database error',
                extractErrorMessage(err),
            ),
        )
        return
    }

    console.error(`[${req.method}] ${req.url} - ${err.message}`, err.stack)

    res.status(500).json(
        formatErrorResponse(
            500,
            'Internal Server Error',
            extractErrorMessage(err),
        ),
    )
}

const formatErrorResponse = (
    statusCode: number,
    message: string,
    details?: any,
) => ({
    statusCode,
    status: statusCode < 500 ? 'fail' : 'error',
    message,
    error: details || message,
})

const extractErrorMessage = (error: any): string => {
    if (error.message) return error.message
    if (typeof error === 'string') return error
    return 'An unexpected error occurred'
}
