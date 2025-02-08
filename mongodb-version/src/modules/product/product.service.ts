import { IProduct } from '../../models/product.model'
import { ProductRepository } from '../../repositories/product.repository'
import { NotFoundError } from '../../shared/errors/errors'
import { ID } from '../../shared/types/id.type'
import { APIFeatures } from '../../utils/apiFeatures'
import { CreateProductDTO, UpdateProductDTO } from './product.dtos'
import NodeCache from 'node-cache';

const productRepository = new ProductRepository()
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export const createProduct = async (
    data: CreateProductDTO,
): Promise<IProduct> => {
    return productRepository.create({
        ...data,
    })
}


export const getAllProducts = async (filter: Record<string, unknown>) => {
    const cacheKey = JSON.stringify(filter);
    
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const apiFeatures = new APIFeatures<IProduct>(filter).getQueryOptions();
    const items = await productRepository.findAll(apiFeatures);
    const total = await productRepository.count(apiFeatures.filter);
    const response = {
        total,
        pages: Math.ceil(total / apiFeatures.take),
        items,
    };

    cache.set(cacheKey, response);

    return response;
};

export const getProduct = async (productId: ID): Promise<IProduct> => {
    const product = await productRepository.findById(productId)
    if (!product) {
        throw new NotFoundError('PRODUCT NOT FOUND')
    }

    return product
}

export const updateProduct = async (
    productId: ID,
    data: UpdateProductDTO,
): Promise<IProduct> => {
    const productExist = await productRepository.findById(productId)
    if (!productExist) {
        throw new NotFoundError('PRODUCT NOT FOUND')
    }

    return productRepository.updateById(productId, data)
}

export const deleteProduct = async (productId: ID): Promise<void> => {
    const product = await productRepository.findById(productId)
    if (!product) {
        throw new NotFoundError('PRODUCT NOT FOUND')
    }

    await productRepository.deleteById(productId)
}
