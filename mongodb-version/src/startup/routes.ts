import { Express } from 'express'
import swaggerDocs from '../config/swagger.config'
import auth from '../modules/auth/auth.routes'
import product from '../modules/product/product.routes'

export default function (app: Express, port: number) {
    app.use('/api/auth', auth)
    app.use('/api/products', product)

    swaggerDocs(app, port)
}
