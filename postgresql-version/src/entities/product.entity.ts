import { Column, Entity, Index } from 'typeorm'
import { AbstractEntity } from './abstract.entity'

@Entity('products')
@Index('product_price_index', ['price'])
export class Product extends AbstractEntity {
    @Column({ type: 'varchar', nullable: false })
    name: string

    @Column({ type: 'varchar', nullable: true })
    category?: string

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number

    @Column({ type: 'int', nullable: false })
    quantity: number
}
