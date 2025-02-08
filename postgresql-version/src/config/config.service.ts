import dotenv from 'dotenv'

class ConfigService {
    constructor() {
        dotenv.config()
    }

    get<T>(key: string, defaultValue?: T): T {
        return (process.env[key] as T) || (defaultValue as T)
    }

    getBoolean(key: string, def = false): boolean {
        const value = this.get<string>(key)
        return value === 'true' ? true : value === 'false' ? false : def
    }

    getPort(): string {
        return this.get<string>('PORT', '8000')
    }

    isDev(): boolean {
        return this.getNodeEnv() === 'development'
    }

    getNodeEnv(): string {
        return this.get<string>('NODE_ENV', 'development')
    }

    getDatabaseHost(): string {
        return this.get<string>('DB_HOST', '')
    }
    getDatabasePort(): string {
        return this.get<string>('5432', '')
    }
    getDatabaseUsername(): string {
        return this.get<string>('DB_USERNAME', '')
    }
    getDatabasePassword(): string {
        return this.get<string>('DB_PASSWORD', '')
    }
    getDatabaseName(): string {
        return this.get<string>('DB_DATABASE', '')
    }

    isDatabaseSyncEnabled(): boolean {
        return this.getBoolean('DB_SYNCHRONIZE', false)
    }

    getFrontendDomain(): string {
        return this.get<string>('FRONTEND_DOMAIN', '')
    }

    getSalt(): string {
        return this.get<string>('PASSWORD_SALT', '')
    }

    getJwtSecret(): string {
        return this.get<string>('JWT_SECRET_KEY', '')
    }

    getJwtRefreshSecret(): string {
        return this.get<string>('JWT_REFRESH_SECRET_KEY', '')
    }
}

export default new ConfigService()
