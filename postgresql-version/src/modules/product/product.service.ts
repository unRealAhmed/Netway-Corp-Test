import { FindOptionsSelect } from 'typeorm'
import { AppDataSource } from '../../config/dataBase'
import { Product } from '../../entities/product.entity'
import { ProductRepository } from '../../repositories/product.repository'
import { NotFoundError } from '../../shared/errors/errors'
import { APIFeatures } from '../../utils/apiFeatures'
import { CreateProductDTO, UpdateProductDTO } from './product.dtos'
import NodeCache from 'node-cache';

const productRepository = new ProductRepository(AppDataSource)
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 }); 

export const createProduct = async (
    data: CreateProductDTO,
): Promise<Product> => {
    const product = productRepository.create(data)
    return productRepository.save(product)
}

export const getAllProducts = async (filter: Record<string, unknown>) => {
    const cacheKey = JSON.stringify(filter);

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    const apiFeatures = new APIFeatures<Product>(filter);
    const queryOptions = apiFeatures.getQueryOptions();

    const result = await productRepository.findAllWithPagination(
        queryOptions.where,
        queryOptions.relations as string[],
        queryOptions.skip || 0,
        queryOptions.take || 10,
        Object.keys(queryOptions.order || {})[0] || 'created_at',
        Object.values(queryOptions.order || {})[0] as 'ASC' | 'DESC',
        queryOptions.select as unknown as FindOptionsSelect<Product>,
    );

    cache.set(cacheKey, result);

    return result;
};


export const getProduct = async (productId: string): Promise<Product> => {
    const product = await productRepository.findOne({
        where: { id: productId },
    })
    if (!product) {
        throw new NotFoundError('PRODUCT NOT FOUND')
    }
    return product
}

export const updateProduct = async (
    productId: string,
    data: UpdateProductDTO,
): Promise<Product> => {
    const productExist = await productRepository.findOne({
        where: { id: productId },
    })
    if (!productExist) {
        throw new NotFoundError('PRODUCT NOT FOUND')
    }

    await productRepository.update(productId, data)
    return productRepository.findOne({
        where: { id: productId },
    }) as Promise<Product>
}

export const deleteProduct = async (productId: string): Promise<void> => {
    const product = await productRepository.findOne({
        where: { id: productId },
    })
    if (!product) {
        throw new NotFoundError('PRODUCT NOT FOUND')
    }

    await productRepository.delete(productId)
}
