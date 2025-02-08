import {
    FindManyOptions,
    FindOptionsOrder,
    FindOptionsWhere,
    LessThanOrEqual,
    MoreThanOrEqual,
    ObjectLiteral,
} from 'typeorm'

interface APIFeaturesConfig {
    defaultLimit: number
    defaultSortField: string
}

interface PaginationOptions {
    page: number
    limit: number
    skip: number
    sortBy: string
    order: 'ASC' | 'DESC'
}

export class APIFeatures<T extends ObjectLiteral> {
    private conditions: FindOptionsWhere<T> = {}
    private pagination: PaginationOptions
    private selectedFields?: (keyof T)[]
    private relations?: string[]
    private readonly config: APIFeaturesConfig

    constructor(
        queryParams: Record<string, unknown>,
        config?: Partial<APIFeaturesConfig>,
    ) {
        this.config = {
            defaultLimit: 10,
            defaultSortField: 'created_at',
            ...config,
        }

        this.pagination = this.extractPagination(queryParams)
        this.conditions = this.extractFilters(queryParams)
        this.selectedFields = this.extractFields(queryParams)
        this.relations = this.extractRelations(queryParams)
    }

    private extractPagination(
        queryParams: Record<string, unknown>,
    ): PaginationOptions {
        const page = Math.max(1, Number(queryParams.page) || 1)
        const limit = Math.max(
            0,
            Number(queryParams.limit) || this.config.defaultLimit,
        )
        const skip = (page - 1) * limit
        const sortBy =
            (queryParams.sortBy as string) || this.config.defaultSortField
        const order: 'ASC' | 'DESC' =
            queryParams.order === 'ASC' ? 'ASC' : 'DESC'

        if (page < 1 || limit < 0) {
            throw new Error('Page and limit must be non-negative numbers.')
        }

        return { page, limit, skip, sortBy, order }
    }

    private extractFilters(
        queryParams: Record<string, unknown>,
    ): FindOptionsWhere<T> {
        const filters: Partial<FindOptionsWhere<T>> = {}
        const excludedFields = new Set([
            'page',
            'limit',
            'sortBy',
            'order',
            'fields',
            'relations',
        ])

        for (const [key, value] of Object.entries(queryParams)) {
            if (!excludedFields.has(key)) {
                this.processFilterValue(filters, key, value)
            }
        }

        return filters as FindOptionsWhere<T>
    }

    private processFilterValue(
        filters: Partial<FindOptionsWhere<T>>,
        key: string,
        value: unknown,
    ): void {
        if (
            (key === 'priceMin' || key === 'priceMax') &&
            typeof value === 'string'
        ) {
            const num: number = Number(value)
            if (!isNaN(num)) {
                if (!filters.hasOwnProperty('price')) {
                    ;(filters as any)['price'] = {}
                }
                if (key === 'priceMin') {
                    ;(filters as any)['price'] = MoreThanOrEqual(num)
                } else if (key === 'priceMax') {
                    ;(filters as any)['price'] = LessThanOrEqual(num)
                }
            }
        } else if (typeof value === 'string') {
            ;(filters as any)[key] = this.sanitizeValue(value)
        }
    }

    private sanitizeValue(value: string): string | number {
        const sanitized = value.replace(/[;{}()]/g, '')
        const num = Number(sanitized)
        return isNaN(num) ? sanitized : num
    }

    private extractFields(
        queryParams: Record<string, unknown>,
    ): (keyof T)[] | undefined {
        if (typeof queryParams.fields === 'string') {
            return queryParams.fields
                .split(',')
                .map(field => field.trim()) as (keyof T)[]
        }
        return undefined
    }

    private extractRelations(
        queryParams: Record<string, unknown>,
    ): string[] | undefined {
        if (typeof queryParams.relations === 'string') {
            return queryParams.relations
                .split(',')
                .map(relation => relation.trim())
        }
        return undefined
    }

    public getQueryOptions(): FindManyOptions<T> {
        return {
            where: this.conditions,
            order: {
                [this.pagination.sortBy]: this.pagination.order,
            } as FindOptionsOrder<T>,
            skip: this.pagination.skip,
            take: this.pagination.limit,
            select: this.selectedFields,
            relations: this.relations,
        }
    }
}
