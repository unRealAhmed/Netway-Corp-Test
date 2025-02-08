import mongoose, { Model, Schema } from 'mongoose'
import { AbstractDocument } from './abstract.model'

export interface IProduct extends AbstractDocument {
    name: string
    category?: string
    price: number
    quantity: number
}

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: false,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true },
)

productSchema.index({ price: 1 })

const Product: Model<IProduct> = mongoose.model<IProduct>(
    'Product',
    productSchema,
)

export default Product
