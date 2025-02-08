import {
    DataSource,
    EntityTarget,
    FindManyOptions,
    FindOptionsOrder,
    FindOptionsSelect,
    FindOptionsWhere,
    Repository,
    UpdateResult,
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { AbstractEntity } from '../entities/abstract.entity'

export class AbstractRepository<
    T extends AbstractEntity,
> extends Repository<T> {
    constructor(entity: EntityTarget<T>, dataSource: DataSource) {
        const repository = dataSource.getRepository(entity)
        super(repository.target, repository.manager, repository.queryRunner)
    }

    async findAllWithPagination(
        conditions: FindManyOptions<T>['where'] = {},
        relations: string[] = [],
        skip: number,
        limit: number,
        sortBy: string,
        order: 'ASC' | 'DESC',
        select?: FindOptionsSelect<T>,
    ): Promise<{ items: T[]; totalCount: number; pages: number }> {
        const [items, totalCount] = await this.findAndCount({
            where: conditions,
            relations,
            skip,
            take: limit,
            order: { [sortBy]: order } as FindOptionsOrder<T>,
            select,
        })

        return { totalCount, pages: Math.ceil(totalCount / 10), items }
    }

    async updateBy(
        conditions: FindOptionsWhere<T>,
        updateDto: QueryDeepPartialEntity<T>,
    ): Promise<{ updatedEntity: T | null; updateResult: UpdateResult }> {
        const updateResult: UpdateResult = await this.update(
            conditions,
            updateDto,
        )
        const updatedEntity: T | null = await this.findOne({
            where: conditions,
        })
        return { updatedEntity, updateResult }
    }
}
