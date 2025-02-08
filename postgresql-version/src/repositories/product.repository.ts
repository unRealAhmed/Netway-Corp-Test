import { DataSource } from 'typeorm'
import { Product } from '../entities/product.entity'
import { AbstractRepository } from './abstract.repository'

export class ProductRepository extends AbstractRepository<Product> {
    constructor(dataSource: DataSource) {
        super(Product, dataSource)
    }
}
