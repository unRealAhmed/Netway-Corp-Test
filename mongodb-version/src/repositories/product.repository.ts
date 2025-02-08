import Product, { IProduct } from '../models/product.model'
import { AbstractRepository } from './abstract.repository'

export class ProductRepository extends AbstractRepository<IProduct> {
    constructor() {
        super(Product)
    }
}
