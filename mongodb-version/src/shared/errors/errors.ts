import { Response } from 'express'
import { CustomError } from './customError'
import { HttpStatus } from './httpCodes'

export class NotFoundError extends CustomError {
    constructor(message: string = 'Resource not found', res?: Response) {
        super(HttpStatus.NOT_FOUND, message)
    }
}

export class BadRequestError extends CustomError {
    constructor(message: string = 'Bad request', res?: Response) {
        super(HttpStatus.BAD_REQUEST, message)
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message: string = 'Unauthorized', res?: Response) {
        super(HttpStatus.UNAUTHORIZED, message)
    }
}

export class ForbiddenError extends CustomError {
    constructor(
        message: string = 'Forbidden: You do not have permission to perform this action.',
        res?: Response,
    ) {
        super(HttpStatus.FORBIDDEN, message)
    }
}

export class ConflictError extends CustomError {
    constructor(message: string = 'Conflict', res?: Response) {
        super(HttpStatus.CONFLICT, message)
    }
}

export class InternalServerError extends CustomError {
    constructor(message: string = 'Internal Server Error', res?: Response) {
        super(HttpStatus.INTERNAL_SERVER_ERROR, message)
    }
}
