import express from 'express'
import * as customerController from '../controllers/admin/customerController.js'
import * as orderController from '../controllers/admin/orderController.js'
import * as productController from '../controllers/admin/productController.js'
import * as roleController from '../controllers/admin/roleController.js'
import * as userController from '../controllers/admin/userController.js'
import * as adminAuthController from '../controllers/admin/adminAuthController.js'
import requirePermission from '../middlewares/requirePermission.js'
import { upload } from '../middlewares/uploadMiddleware.js'

const router = express.Router()

// Auth (own profile — no extra permission needed)
router.get('/auth/me', adminAuthController.me)
router.patch('/auth/me', adminAuthController.updateMe)
router.patch('/auth/password', adminAuthController.changePassword)

// Customers
router.get('/customers', requirePermission('customers.view'), customerController.findAll)
router.get('/customers/:id', requirePermission('customers.view'), customerController.findOne)
router.post('/customers', requirePermission('customers.create'), customerController.create)
router.patch('/customers/:id', requirePermission('customers.update'), customerController.update)
router.delete('/customers/bulk', requirePermission('customers.delete'), customerController.bulkRemove)
router.delete('/customers/:id', requirePermission('customers.delete'), customerController.remove)

// Orders
router.get('/orders', requirePermission('orders.view'), orderController.findAll)
router.get('/orders/:id', requirePermission('orders.view'), orderController.findOne)
router.post('/orders', requirePermission('orders.create'), orderController.create)
router.patch('/orders/:id', requirePermission('orders.update'), orderController.update)
router.delete('/orders/bulk', requirePermission('orders.delete'), orderController.bulkRemove)
router.delete('/orders/:id', requirePermission('orders.delete'), orderController.remove)

// Products
router.get('/products', requirePermission('products.view'), productController.getProducts)
router.get('/products/:id', requirePermission('products.view'), productController.getProductById)
router.post('/products', requirePermission('products.create'), upload.single('image'), productController.createProduct)
router.put('/products/:id', requirePermission('products.update'), upload.single('image'), productController.updateProduct)
router.delete('/products/bulk', requirePermission('products.delete'), productController.bulkDeleteProducts)
router.delete('/products/:id', requirePermission('products.delete'), productController.deleteProduct)

// Roles
router.get('/roles/all', requirePermission('roles.view'), roleController.findAllSimple)
router.get('/roles', requirePermission('roles.view'), roleController.findAll)
router.get('/roles/:id', requirePermission('roles.view'), roleController.findOne)
router.post('/roles', requirePermission('roles.create'), roleController.create)
router.patch('/roles/:id', requirePermission('roles.update'), roleController.update)
router.delete('/roles/bulk', requirePermission('roles.delete'), roleController.bulkRemove)
router.delete('/roles/:id', requirePermission('roles.delete'), roleController.remove)

// Users
router.get('/users', requirePermission('users.view'), userController.findAll)
router.get('/users/:id', requirePermission('users.view'), userController.findOne)
router.post('/users', requirePermission('users.create'), userController.create)
router.patch('/users/:id', requirePermission('users.update'), userController.update)
router.delete('/users/bulk', requirePermission('users.delete'), userController.bulkRemove)
router.delete('/users/:id', requirePermission('users.delete'), userController.remove)

export default router
