import { Document, Schema, model } from 'mongoose'
import { ID } from '../shared/types/id.type'

export interface IRefreshToken extends Document {
    userId: ID
    token: string
    createdAt: Date
}

const refreshTokenSchema = new Schema<IRefreshToken>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        token: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
)

export const RefreshToken = model<IRefreshToken>(
    'RefreshToken',
    refreshTokenSchema,
)
