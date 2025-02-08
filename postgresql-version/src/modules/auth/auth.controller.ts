import { NextFunction, Request, Response } from 'express'
import * as AuthService from './auth.service'

export const signUp = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const user = await AuthService.signUp(req.body, res)
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { email, password } = req.body
        const response = await AuthService.login(email, password, res)
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const userId = req.user?.userId
        await AuthService.logout(userId!, res)
        res.status(200).json({
            status: 'success',
            message: 'LOGOUT SUCCESS',
        })
    } catch (error) {
        next(error)
    }
}

export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const refreshToken = req.cookies.refreshJwt
        if (!refreshToken) {
            res.status(401).json({
                status: 'fail',
                message: 'REFRESH TOKEN MISSING',
            })
        }

        const response = await AuthService.refreshToken(refreshToken, res)
        res.status(200).json({
            status: 'success',
            data: response,
        })
    } catch (error) {
        next(error)
    }
}
