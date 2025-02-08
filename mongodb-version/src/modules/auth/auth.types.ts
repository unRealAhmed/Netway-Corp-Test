import { ID } from '../../shared/types/id.type'

export type SignUpResponse = {
    _id: ID
    fullname: string
    email: string
    role: string
    createdAt: Date
    updatedAt: Date
    accessToken: string
}

type UserData = {
    _id: ID
    fullname: string
    role: string
}

export type LoginResponse = {
    user: UserData
    accessToken: string
}
