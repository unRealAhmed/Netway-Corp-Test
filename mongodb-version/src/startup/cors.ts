import cors from 'cors'
import { Express } from 'express'
import configService from '../config/config.service'

export default function (app: Express) {
    const frontendDomain = configService.getFrontendDomain()
    const corsOptions = {
        origin: frontendDomain || 'http://localhost:5173',
        credentials: true,
        optionSuccessStatus: 200,
    }
    app.use(cors(corsOptions))
}
