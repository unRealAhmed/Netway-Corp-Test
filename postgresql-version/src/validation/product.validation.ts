import { checkSchema } from 'express-validator'

const nameSchema = {
    isString: { errorMessage: 'Name must be a string.' },
    notEmpty: { errorMessage: 'Name is required.' },
    trim: true,
}

const categorySchema = {
    isString: { errorMessage: 'Category must be a string.' },
    optional: true,
    trim: true,
}

const priceSchema = {
    isFloat: {
        options: { min: 0 },
        errorMessage: 'Price must be a positive number.',
    },
    toFloat: true,
}

const quantitySchema = {
    isInt: {
        options: { min: 0 },
        errorMessage: 'Quantity must be a non-negative integer.',
    },
    toInt: true,
}

export const productSchemas = {
    createProduct: checkSchema({
        name: nameSchema,
        category: categorySchema,
        price: priceSchema,
        quantity: quantitySchema,
    }),

    updateProduct: checkSchema({
        name: { ...nameSchema, optional: true },
        category: { ...categorySchema, optional: true },
        price: { ...priceSchema, optional: true },
        quantity: { ...quantitySchema, optional: true },
    }),
}
