import { FilterQuery, PopulateOptions, ProjectionType } from 'mongoose'

interface APIFeaturesConfig {
    defaultLimit: number
    defaultSortField: string
}

interface PaginationOptions {
    page: number
    limit: number
    skip: number
    sortBy: string
    order: -1 | 1
}

export class APIFeatures<T> {
    private conditions: FilterQuery<T> = {}
    private pagination: PaginationOptions
    private selectedFields?: ProjectionType<T>
    private relations?: PopulateOptions | PopulateOptions[]
    private readonly config: APIFeaturesConfig

    constructor(
        queryParams: Record<string, unknown>,
        config?: Partial<APIFeaturesConfig>,
    ) {
        this.config = {
            defaultLimit: 10,
            defaultSortField: 'createdAt',
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
        const limit = Math.max(0, Number(queryParams.limit) || this.config.defaultLimit)
        const skip = (page - 1) * limit
        const sortBy = (queryParams.sortBy as string) || this.config.defaultSortField
        const order: -1 | 1 = queryParams.order === 'ASC' ? 1 : -1

        return { page, limit, skip, sortBy, order }
    }

    private extractFilters(
        queryParams: Record<string, unknown>,
    ): FilterQuery<T> {
        const filters: FilterQuery<T> = {}
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

        return filters
    }

    private processFilterValue(
        filters: FilterQuery<T>,
        key: string,
        value: unknown,
    ): void {
        if (
            (key === 'priceMin' || key === 'priceMax') &&
            typeof value === 'string'
        ) {
            const num = Number(value)
            if (!isNaN(num)) {
                if (!(filters as Record<string, any>).price) {
                    ; (filters as Record<string, any>).price = {}
                }
                if (key === 'priceMin') {
                    ; (filters as Record<string, any>).price.$gte = num
                } else if (key === 'priceMax') {
                    ; (filters as Record<string, any>).price.$lte = num
                }
            }
        } else if (typeof value === 'string') {
            ; (filters as Record<string, unknown>)[key] =
                this.sanitizeValue(value)
        }
    }

    private sanitizeValue(value: string): string | number {
        const sanitized = value.replace(/[;{}()]/g, '')
        const num = Number(sanitized)
        return isNaN(num) ? sanitized : num
    }

    private extractFields(
        queryParams: Record<string, unknown>,
    ): ProjectionType<T> | undefined {
        if (typeof queryParams.fields === 'string') {
            const fields = queryParams.fields
                .split(',')
                .map(field => field.trim())
            return fields.reduce((acc, field) => ({ ...acc, [field]: 1 }), {})
        }
        return undefined
    }

    private extractRelations(
        queryParams: Record<string, unknown>,
    ): PopulateOptions | PopulateOptions[] | undefined {
        if (typeof queryParams.relations === 'string') {
            return queryParams.relations
                .split(',')
                .map(relation => ({ path: relation.trim() }))
        }
        return undefined
    }

    public getQueryOptions() {
        return {
            filter: this.conditions,
            select: this.selectedFields,
            skip: this.pagination.skip,
            take: this.pagination.limit,
            sort: this.pagination.sortBy,
            sortDirection: this.pagination.order,
            populate: this.relations,
        }
    }
}
