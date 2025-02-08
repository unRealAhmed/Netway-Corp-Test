import mongoose, { Model, Schema } from 'mongoose'
import { RolesEnum, RolesType } from '../shared/types/roles'
import { AbstractDocument } from './abstract.model'

export interface IUser extends AbstractDocument {
    fullname: string
    email: string
    password: string
    role: RolesType
}

const userSchema = new Schema<IUser>(
    {
        fullname: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: RolesEnum,
            default: RolesEnum.USER,
        },
    },
    {
        timestamps: true,
    },
)

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)

export default User
