export type SignUpResponse = {
    id: string
    fullname: string
    email: string
    role: string
    created_at: Date
    updated_at: Date
    accessToken: string
}

type UserData = {
    id: string
    fullname: string
    role: string
}

export type LoginResponse = {
    user: UserData
    accessToken: string
}
