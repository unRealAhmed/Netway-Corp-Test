import express from 'express'
import { extractUserFromToken } from '../../middleware/auth'
import { authorizeRoles } from '../../middleware/authorize'
import { validate } from '../../middleware/validate'
import { RolesEnum } from '../../shared/types/roles'
import { productSchemas } from '../../validation/product.validation'
import * as ProductController from './product.controller'

const router = express.Router()

router.post(
    '/',
    extractUserFromToken,
    authorizeRoles(RolesEnum.ADMIN),
    validate(productSchemas.createProduct),
    ProductController.createProduct,
)

router.get('/', ProductController.getAllProducts)

router.get('/:id', ProductController.getProduct)

router.patch(
    '/:id',
    extractUserFromToken,
    authorizeRoles(RolesEnum.ADMIN),
    validate(productSchemas.updateProduct),
    ProductController.updateProduct,
)

router.delete(
    '/:id',
    extractUserFromToken,
    authorizeRoles(RolesEnum.ADMIN),
    ProductController.deleteProduct,
)

export default router
