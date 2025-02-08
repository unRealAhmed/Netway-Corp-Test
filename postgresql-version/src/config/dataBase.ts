import { DataSource } from 'typeorm'
import { Product, RefreshToken, User } from '../entities'
import configService from './config.service'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: configService.getDatabaseHost(),
    port: Number(configService.getDatabasePort()),
    username: configService.getDatabaseUsername(),
    password: configService.getDatabasePassword(),
    database: configService.getDatabaseName(),
    synchronize: configService.isDatabaseSyncEnabled(),
    logging: true,
    entities: [User, Product, RefreshToken],
    uuidExtension: 'pgcrypto',
})

export async function connectDatabase() {
    try {
        await AppDataSource.initialize()
        console.log('Database Connected Successfully...👍')
    } catch (error: any) {
        console.error(`Error connecting to the database: ${error.message}`)
    }
}
