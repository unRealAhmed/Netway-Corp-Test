import { Document } from 'mongoose'
import { ID } from '../shared/types/id.type'

export abstract class AbstractDocument extends Document {
    _id: ID
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date | null = null
}
