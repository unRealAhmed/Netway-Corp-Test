import dotenv from 'dotenv'

class ConfigService {
    constructor() {
        dotenv.config()
    }

    get<T>(key: string, defaultValue?: T): T {
        return (process.env[key] as T) || (defaultValue as T)
    }

    getPort(): string {
        return this.get<string>('PORT', '8000')
    }

    getNodeEnv(): string {
        return this.get<string>('NODE_ENV', 'development')
    }

    getDatabaseUrl(): string {
        return this.get<string>('DATABASE_URL', '')
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
