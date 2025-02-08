import {
    FilterQuery,
    Model,
    PopulateOptions,
    ProjectionType,
    UpdateQuery,
} from 'mongoose'
import { InternalServerError } from '../shared/errors/errors'
import { ID } from '../shared/types/id.type'

export abstract class AbstractRepository<TDocument> {
    protected constructor(protected readonly model: Model<TDocument>) {}

    async create(document: Partial<TDocument>): Promise<TDocument> {
        try {
            return this.model.create(document) as TDocument
        } catch (error) {
            throw new InternalServerError(
                `Failed to create resource ${this.model.modelName}`,
            )
        }
    }

    findAll<T = TDocument>(options?: {
        filter?: FilterQuery<TDocument>
        select?: ProjectionType<TDocument>
        skip?: number
        take?: number
        sort?: string
        sortDirection?: -1 | 1
        populate?: PopulateOptions | PopulateOptions[]
    }): Promise<T[]> {
        const filter = {
            ...options?.filter,
            deletedAt: null,
        }

        const select = {
            deletedAt: 0,
            __v: 0,
            ...(options?.select as Record<string, unknown>),
        }

        let query = this.model.find<T>(filter, select)

        if (Array.isArray(options?.populate)) {
            options.populate.forEach(populateOption => {
                query = query.populate(populateOption)
            })
        } else if (options?.populate) {
            query = query.populate(options.populate)
        }

        const skip = options?.skip ?? 0
        const limit = options?.take ?? 10

        query = query.skip(skip).limit(limit)

        return query
            .sort({
                [options?.sort ?? 'createdAt']: options?.sortDirection ?? -1,
            })
            .lean()
            .exec() as unknown as Promise<T[]>
    }

    async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
        return this.model
            .findOne({ ...filterQuery, deletedAt: null })
            .lean()
            .exec() as TDocument
    }

    async findById(id: ID): Promise<TDocument> {
        return this.model.findById(id).lean().exec() as TDocument
    }

    async updateById(
        id: ID,
        update: UpdateQuery<TDocument>,
    ): Promise<TDocument> {
        return this.model
            .findByIdAndUpdate(id, update, { new: true, lean: true })
            .exec() as TDocument
    }

    async updateMany(
        filterQuery: FilterQuery<TDocument>,
        updateQuery: UpdateQuery<TDocument>,
    ): Promise<{ success: boolean; modifiedCount?: number }> {
        const result = await this.model
            .updateMany(filterQuery, updateQuery)
            .exec()
        return {
            success: true,
            modifiedCount: result.modifiedCount,
        }
    }

    async deleteById(id: ID): Promise<TDocument> {
        return this.model.findByIdAndDelete(id).exec() as TDocument
    }

    async softDeleteById(id: ID): Promise<TDocument> {
        return this.model
            .findByIdAndUpdate(
                id,
                { deletedAt: new Date() },
                { new: true, lean: true },
            )
            .exec() as TDocument
    }

    async softDelete(filterQuery: FilterQuery<TDocument>) {
        return this.model.findOneAndUpdate<TDocument>(
            {
                ...filterQuery,
                deletedAt: null,
            },
            {
                deletedAt: new Date(),
            },
        )
    }

    async findOneAndUpdate(
        filterQuery: FilterQuery<TDocument>,
        update: UpdateQuery<TDocument>,
    ): Promise<TDocument> {
        return this.model
            .findOneAndUpdate(filterQuery, update, { new: true, lean: true })
            .exec() as TDocument
    }

    async findByIdAndUpdate(
        id: ID,
        update: Partial<TDocument>,
        options = { new: true },
    ) {
        return this.model
            .findByIdAndUpdate(id, update, options)
            .exec() as TDocument
    }

    async exists(filterQuery: FilterQuery<TDocument>): Promise<boolean> {
        return !!(await this.model.exists({ ...filterQuery, deletedAt: null }))
    }

    async distinct(
        item: string,
        filter: FilterQuery<TDocument>,
    ): Promise<unknown[]> {
        return this.model.distinct(item, filter)
    }

    async count(filterQuery: FilterQuery<TDocument>): Promise<number> {
        return this.model
            .countDocuments({ ...filterQuery, deletedAt: null })
            .exec()
    }

    async deleteMany(
        filterQuery: FilterQuery<TDocument>,
    ): Promise<{ success: boolean; deletedCount?: number }> {
        const result = await this.model.deleteMany(filterQuery).exec()
        return {
            success: true,
            deletedCount: result.deletedCount,
        }
    }
}
