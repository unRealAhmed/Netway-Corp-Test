import { debug } from 'console'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import morgan from 'morgan'
import configService from './config/config.service'
import { connectDatabase } from './config/dataBase'
import { globalErrorHandler } from './middleware/globalErrorHandler'
import cors from './startup/cors'
import routers from './startup/routes'
import serializer from './startup/serializer'
dotenv.config()

const app = express()
app.use((req, res, next) => {
    express.json()(req, res, err => {
        if (err instanceof SyntaxError) {
            return res.status(400).json({
                statusCode: 400,
                status: 'fail',
                message: 'Invalid JSON payload',
                error: err.message,
            })
        }
        next()
    })
})
cors(app)
serializer(app)
app.use(morgan('tiny'))
app.use(hpp())
app.use(
    '/api',
    rateLimit({
        max: 200,
        windowMs: 60 * 60 * 1000,
        message: 'Too many requests from this IP, please try again in an hour!',
    }),
)

connectDatabase()

const port = Number(configService.getPort())
routers(app, port)

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`,
    })
})

app.use(globalErrorHandler)

app.listen(port, () => {
    debug('Application started')
    console.log(`Server started at http://localhost:${port}`)
})
