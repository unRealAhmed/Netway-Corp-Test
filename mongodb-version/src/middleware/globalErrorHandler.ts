import { BSONError } from 'bson'
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { MongoServerError } from 'mongodb'
import mongoose from 'mongoose'
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

    if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).json(
            formatErrorResponse(400, 'Mongoose Validation Error', err.errors),
        )
        return
    }

    if (err instanceof mongoose.Error.CastError) {
        res.status(400).json(
            formatErrorResponse(400, `Invalid ${err.path}: ${err.value}`),
        )
        return
    }

    if (err instanceof BSONError) {
        res.status(400).json(
            formatErrorResponse(400, 'Invalid ObjectId format'),
        )
        return
    }

    if (err instanceof MongoServerError) {
        res.status(400).json(
            formatErrorResponse(
                400,
                'MongoDB Server Error',
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
