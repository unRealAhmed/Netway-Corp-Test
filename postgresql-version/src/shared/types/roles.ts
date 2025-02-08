export const RolesEnum = {
    ADMIN: 'admin',
    USER: 'user',
} as const

export type RolesType = (typeof RolesEnum)[keyof typeof RolesEnum]

export const RolesTypeValues = Object.values(RolesEnum)
