import { checkSchema } from 'express-validator'

const passwordSchema = {
    isString: { errorMessage: 'Password must be a string.' },
    isLength: {
        options: { min: 6 },
        errorMessage: 'Password must be at least 6 characters long.',
    },
}

const emailSchema = {
    isEmail: { errorMessage: 'Invalid email address.' },
    trim: true,
}

const fullnameSchema = {
    isString: { errorMessage: 'Full name must be a string.' },
    isLength: {
        options: { min: 3, max: 50 },
        errorMessage: 'Full name must be between 3 and 50 characters long.',
    },
}

export const userSchemas = {
    register: checkSchema({
        fullname: fullnameSchema,
        email: emailSchema,
        password: passwordSchema,
    }),

    login: checkSchema({
        email: emailSchema,
        password: passwordSchema,
    }),
}
