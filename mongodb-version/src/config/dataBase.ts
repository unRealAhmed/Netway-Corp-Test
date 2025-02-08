import mongoose from 'mongoose'
import configService from './config.service'

export default async function connectDatabase() {
    try {
        const dbUrl = configService.getDatabaseUrl()
        await mongoose.connect(dbUrl)
        console.log('Database Connected Successfully...👍')
    } catch (error: any) {
        console.error(`Error connecting to the database: ${error.message}`)
    }
}
