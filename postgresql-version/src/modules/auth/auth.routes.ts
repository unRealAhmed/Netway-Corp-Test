import express from 'express'
import { extractUserFromToken } from '../../middleware/auth'
import { validate } from '../../middleware/validate'
import { userSchemas } from '../../validation/auth.validation'
import * as AuthController from './auth.controller'

const router = express.Router()

router.post('/signup', validate(userSchemas.register), AuthController.signUp)

router.post('/login', validate(userSchemas.login), AuthController.login)

router.post('/logout', extractUserFromToken, AuthController.logout)

router.post('/refresh-token', AuthController.refreshToken)

export default router
