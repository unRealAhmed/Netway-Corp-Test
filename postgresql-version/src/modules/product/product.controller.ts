import { NextFunction, Request, Response } from 'express'
import * as ProductService from './product.service'

export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const product = await ProductService.createProduct(req.body)
        res.status(201).json(product)
    } catch (error) {
        next(error)
    }
}

export const getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const products = await ProductService.getAllProducts(req.query)
        res.status(200).json(products)
    } catch (error) {
        next(error)
    }
}

export const getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const product = await ProductService.getProduct(req.params.id)
        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const updatedProduct = await ProductService.updateProduct(
            req.params.id,
            req.body,
        )
        res.status(200).json(updatedProduct)
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        await ProductService.deleteProduct(req.params.id)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
}
